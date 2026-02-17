#!/usr/bin/env python3
"""
Test contact form logging.
"""
import os
import sys
import tempfile
import json
from pathlib import Path

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

def test_contact_logging():
    """Test that submitting contact form creates log entry."""
    app = create_app({'TESTING': True, 'WTF_CSRF_ENABLED': False})
    client = app.test_client()
    
    # Ensure logs directory exists
    log_dir = Path(__file__).parent / 'logs'
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / 'messages.txt'
    if log_file.exists():
        # Backup original content
        original = log_file.read_text()
    else:
        original = None
    
    # Submit contact form
    response = client.post('/contact', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'subject': 'other',
        'message': 'This is a test message from automated test.',
        'newsletter': False
    }, follow_redirects=True)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    # Check that log file was written
    assert log_file.exists(), "Log file not created"
    content = log_file.read_text()
    assert 'Test User' in content
    assert 'test@example.com' in content
    assert 'This is a test message from automated test.' in content
    
    # Clean up: restore original content
    if original is not None:
        log_file.write_text(original)
    else:
        log_file.unlink()
    
    print("✓ Contact logging test passed")
    return True

if __name__ == '__main__':
    try:
        test_contact_logging()
    except Exception as e:
        print(f"✗ Test failed: {e}")
        sys.exit(1)