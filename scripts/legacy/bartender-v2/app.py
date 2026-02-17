"""
Bartender V2.0 - Flask Backend Core

This module implements the backend for a cocktail recipe platform.
It provides web routes for UI pages and API endpoints for cocktail data.
"""

import json
import re
import logging
import os
from pathlib import Path

from flask import Flask, jsonify, render_template, abort, Blueprint, request, flash, redirect, url_for
from flask_wtf.csrf import CSRFProtect
from flask_httpauth import HTTPBasicAuth
from pydantic_settings import BaseSettings, SettingsConfigDict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Path to the cocktails JSON file
COCKTAILS_JSON_PATH = Path(__file__).parent / "data" / "cocktails.json"


class FlaskSettings(BaseSettings):
    """
    Flask application settings loaded from environment variables.
    """
    SECRET_KEY: str
    FLASK_USER: str
    FLASK_PASSWORD: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def validate_secret_key(self):
        """Ensure SECRET_KEY is at least 32 characters long."""
        if len(self.SECRET_KEY) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")

    def require_all(self):
        """Validate all required fields."""
        self.validate_secret_key()
        if not self.FLASK_USER or not self.FLASK_PASSWORD:
            raise ValueError("FLASK_USER and FLASK_PASSWORD must be set")


def load_cocktails():
    """
    Load cocktail data from JSON file.

    Returns:
        list: A list of cocktail dictionaries. Returns empty list on error.

    Raises:
        Logs errors but does not raise exceptions to keep the app running.
    """
    try:
        with open(COCKTAILS_JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        logger.info(f"Loaded {len(data)} cocktails from {COCKTAILS_JSON_PATH}")
        return data
    except FileNotFoundError:
        logger.error(f"Cocktails file not found at {COCKTAILS_JSON_PATH}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {COCKTAILS_JSON_PATH}: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error loading cocktails: {e}")
        return []


def log_contact_message(data):
    """
    Log contact form submission to logs/messages.txt.

    Args:
        data (dict): Dictionary with keys 'name', 'email', 'message'.
    """
    import os
    from datetime import datetime
    log_dir = os.path.join(os.path.dirname(__file__), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'messages.txt')
    timestamp = datetime.utcnow().isoformat() + 'Z'
    entry = f"[{timestamp}] {data['name']} <{data['email']}>: \"{data['message']}\"\n"
    try:
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(entry)
        logger.info(f"Logged contact message from {data['email']}")
    except Exception as e:
        logger.error(f"Failed to write contact log: {e}")

def create_app(config=None):
    """
    Application factory function.

    Args:
        config (dict, optional): Configuration overrides.

    Returns:
        Flask: The Flask application instance.
    """
    app = Flask(__name__)

    # Load and validate settings
    try:
        settings = FlaskSettings()
        settings.require_all()
    except Exception as e:
        raise RuntimeError(f"Failed to load configuration: {e}") from e

    # Default configuration
    app.config["JSON_SORT_KEYS"] = False
    app.config["DEBUG"] = os.environ.get("FLASK_ENV") == "development"
    app.config["SECRET_KEY"] = settings.SECRET_KEY
    app.config["FLASK_USER"] = settings.FLASK_USER
    app.config["FLASK_PASSWORD"] = settings.FLASK_PASSWORD
    if config:
        app.config.update(config)
    # CSRF protection
    csrf = CSRFProtect(app)

    # HTTP Basic Authentication
    auth = HTTPBasicAuth()

    @auth.verify_password
    def verify_password(username, password):
        return username == app.config["FLASK_USER"] and password == app.config["FLASK_PASSWORD"]


    # Blueprint for web pages
    main_bp = Blueprint("main", __name__)

    @main_bp.route("/")
    def home():
        """Home page with hero section and featured cocktails."""
        return render_template("home.html")

    @main_bp.route("/recipes")
    def recipes():
        """Recipe feed page."""
        return render_template("recipes.html")

    @main_bp.route("/recipe/<int:id>")
    def recipe_detail(id):
        """Recipe detail page with data from JSON."""
        cocktails = load_cocktails()
        cocktail = next((c for c in cocktails if c.get("id") == id), None)
        if cocktail is None:
            abort(404)
        # Similar cocktails: exclude current, limit to 4
        similar = [c for c in cocktails if c.get("id") != id][:4]
        return render_template("recipe_detail.html", cocktail=cocktail, similar_cocktails=similar)

    @main_bp.route("/contact", methods=["GET", "POST"])
    def contact():
        """Contact form page."""
        errors = {}
        if request.method == "POST":
            name = request.form.get("name", "").strip()
            email = request.form.get("email", "").strip()
            message = request.form.get("message", "").strip()
            subject = request.form.get("subject", "")
            newsletter = request.form.get("newsletter") == "on"

            # Validation
            if not name:
                errors["name"] = "Name is required."
            if not email:
                errors["email"] = "Email is required."
            elif not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                errors["email"] = "Invalid email format."
            if not message:
                errors["message"] = "Message is required."
            elif len(message) < 10:
                errors["message"] = "Message must be at least 10 characters."

            if not errors:
                # Log the message
                log_contact_message({"name": name, "email": email, "message": message})
                flash("Thank you! Your message has been sent.", "success")
                return redirect(url_for("main.contact"))
            else:
                flash("Please correct the errors below.", "error")
        else:
            name = email = message = subject = ""
            newsletter = False

        return render_template("contact.html",
                               name=name, email=email, message=message,
                               subject=subject, newsletter=newsletter, errors=errors)

    # Blueprint for API endpoints
    api_bp = Blueprint("api", __name__, url_prefix="/api")

    @api_bp.route("/cocktails", methods=["GET"])
    @auth.login_required
    def get_cocktails():
        """
        API endpoint returning all cocktails as JSON.

        Returns:
            JSON response with list of cocktails or error message.
        """
        cocktails = load_cocktails()
        if not cocktails:
            return jsonify({"error": "No cocktail data available"}), 503
        return jsonify(cocktails)

    @api_bp.route("/cocktails/<int:id>", methods=["GET"])
    @auth.login_required
    def get_cocktail_by_id(id):
        """
        API endpoint returning a specific cocktail by ID.

        Returns:
            JSON response with cocktail data or 404 if not found.
        """
        cocktails = load_cocktails()
        cocktail = next((c for c in cocktails if c.get("id") == id), None)
        if cocktail is None:
            return jsonify({"error": "Cocktail not found"}), 404
        return jsonify(cocktail)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    # Custom error handlers
    @app.errorhandler(404)
    def not_found(error):
        """Custom 404 error page."""
        return render_template("404.html"), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        """Custom 500 error page."""
        logger.error(f"Internal server error: {error}")
        return render_template("500.html", debug=app.config["DEBUG"]), 500

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)