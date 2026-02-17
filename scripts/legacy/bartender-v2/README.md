# Bartender V2.0 – Cocktail Recipe Platform

A Flask‑based web application for browsing, searching, and printing cocktail recipes. Features a modern dark theme, instant search, responsive design, and print‑optimized recipe pages.

## Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop.
- **Instant Search & Filtering**: Live search by name, base spirit, difficulty, and tags without page reloads.
- **Recipe Detail Pages**: Beautifully formatted pages with ingredients, instructions, garnish, glassware, and similar cocktails.
- **Print‑Friendly Recipes**: CSS print styles hide navigation/footer and optimize layout for paper; each recipe includes a “Print Recipe” button.
- **Contact Form with Logging**: User submissions are logged to `logs/messages.txt` with timestamps.
- **RESTful API**: JSON endpoints (`/api/cocktails`, `/api/cocktails/<id>`) for programmatic access to cocktail data (protected with HTTP Basic Authentication).
- **Error Pages**: Custom 404 and 500 error pages with helpful messages.
- **Sticky Navigation**: Navigation bar stays fixed at the top while scrolling.

## Tech Stack

- **Backend**: Python 3, Flask, Flask‑WTF (CSRF protection), Flask-HTTPAuth (HTTP Basic Authentication), pydantic-settings (configuration validation)
- **Frontend**: HTML5, CSS3 (CSS Custom Properties, Flexbox, Grid), vanilla JavaScript (ES6+)
- **Data**: Cocktail recipes stored in `data/cocktails.json`
- **Logging**: Plain‑text log files with UTC timestamps

## Project Structure

```
Bartender‑V2.0/
├── app.py                 # Flask application factory & routes
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── data/
│   └── cocktails.json    # Cocktail recipe database
├── logs/                 # Contact message logs (auto‑created)
├── static/
│   ├── css/
│   │   └── style.css    # Main stylesheet (includes print styles)
│   └── js/
│       └── search.js    # Instant search & filtering logic
└── templates/
    ├── base.html        # Base template with navigation/footer
    ├── home.html        # Homepage with hero & featured cocktails
    ├── recipes.html     # Recipe feed with search & filters
    ├── recipe_detail.html # Detailed recipe view
    ├── contact.html     # Contact form page
    ├── 404.html         # Custom 404 page
    └── 500.html         # Custom 500 page
```

## Setup & Installation

1. **Clone the repository** (or download the source).

2. **Create a virtual environment** (recommended):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate   # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the development server**:
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5000` (or a different port if `PORT` environment variable is set).

5. **Open your browser** and navigate to `http://localhost:5000`.

## Running Tests

The project includes a simple test for contact‑form logging:
```bash
python test_logging.py
```

## Configuration

The application uses environment variables for configuration. A `.env.template` file is provided as a reference.

### Required Environment Variables

- **SECRET_KEY**: Secret key for Flask session security (must be at least 32 characters). If not set, the application will raise an error.
- **FLASK_USER**: Username for HTTP Basic Authentication on API endpoints.
- **FLASK_PASSWORD**: Password for HTTP Basic Authentication.

Set these variables in a `.env` file (copy from `.env.template`) or directly in the environment.

### Optional Environment Variables

- **FLASK_ENV**: Set to `development` to enable debug mode, `production` to disable.
- **PORT**: Override the default port (5000).
- **DEBUG**: Override debug mode (defaults to `True` when `FLASK_ENV=development`).

### Authentication

API endpoints (`/api/cocktails`, `/api/cocktails/<id>`) are protected with HTTP Basic Authentication using the credentials set in `FLASK_USER` and `FLASK_PASSWORD`. Web pages remain publicly accessible.

### Security Notes

- Never commit `.env` file to version control.
- Use strong, randomly generated secrets in production.
- The application validates that `SECRET_KEY` is at least 32 characters long.

## Usage Notes

- **Search**: Type in the search box on the recipes page; results update as you type (debounced).
- **Filters**: Use the dropdowns to filter by base spirit and/or difficulty. Multiple selections are allowed.
- **Print Recipe**: Click the “Print Recipe” button on any recipe detail page to open the browser’s print dialog. The printed page hides navigation, footer, and non‑essential elements.
- **Contact Form**: Fill out the form on the Contact page; submissions are logged to `logs/messages.txt` with a UTC timestamp.

## Known Limitations / TODOs

- Placeholder images are used for cocktail photos; replace with actual cocktail images.
- Font Awesome icons are loaded from a CDN; offline usage requires local copies.
- No database persistence (recipes are loaded from a static JSON file).
- The “Load More” button on the recipes page is a placeholder (no pagination implemented).

## License

This project is provided for educational/demonstration purposes. Feel free to adapt it for your own use.