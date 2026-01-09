import os

from .base import *

# En producción, DEBUG debe ser Falso [cite: 161]
DEBUG = False

# Leemos ALLOWED_HOSTS del .env (obligatorio en prod)

allowed_hosts_env = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = allowed_hosts_env.split(",")

CORS_ALLOWED_ORIGINS = [
    "http://localhost",  # <--- SIN el :80
    "http://localhost:8080",  # Por si acaso usas el puerto 8080 explícito
    "http://127.0.0.1",
    "http://127.0.0.1:8080",
]
# Seguridad extra para producción [cite: 161]
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 0  #
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
