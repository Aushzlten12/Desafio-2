import os

from .base import *

# En producción, DEBUG debe ser Falso [cite: 161]
DEBUG = False

# Leemos ALLOWED_HOSTS del .env (obligatorio en prod)
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
# Seguridad extra para producción [cite: 161]
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
