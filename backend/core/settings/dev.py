from .base import *

# Configuración específica para desarrollo
DEBUG = True
ALLOWED_HOSTS = ["*"]

# En dev, a veces queremos ver los emails en consola en lugar de enviarlos
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
