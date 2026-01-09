# Microservicio Django - Backend

Este repositorio contiene el backend del desafío técnico, desarrollado como un microservicio RESTful listo para producción. Está construido sobre **Django 5** y **Django REST Framework**, utilizando **PostgreSQL** como base de datos y orquestado totalmente con **Docker**.

## Stack Tecnológico

* **Lenguaje:** Python 3.12
* **Framework:** Django 5 + DRF
* **Base de Datos:** PostgreSQL 15
* **Infraestructura:** Docker & Docker Compose (Multi-stage build)
* **Servidor App:** Gunicorn (Producción)
* **Seguridad:** JWT (SimpleJWT), CORS, Hashes seguros.
* **Observabilidad:** Prometheus Metrics, Health Checks, Logs Estructurados.
* **Calidad:** Tests (Coverage > 85%), Ruff, Black, Pre-commit.

---

## Prerrequisitos

* **Docker Desktop** (con integración WSL 2 en Windows).
* **Make** (Opcional, incluido en Linux/WSL para ejecutar comandos rápidos).

---

## Configuración del Entorno (.env)

Antes de iniciar, crea un archivo `.env` en la raíz de esta carpeta con el siguiente contenido. Estas variables son inyectadas en el contenedor de Docker.

```env
# --- Django Core ---
# 'dev' para local con debug, 'prod' para despliegue seguro
DJANGO_SETTINGS_MODULE=core.settings.dev
SECRET_KEY=django-insecure-clave-secreta-local-dev
DEBUG=True
ALLOWED_HOSTS=*

# CORS: Importante agregar los orígenes del Frontend (Docker y Local)
CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:4200,http://localhost:8080
JWT_ACCESS_TTL_MIN=60

# --- Base de Datos (PostgreSQL) ---
POSTGRES_DB=app_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password_seguro_123

# 'db' es el nombre del servicio definido en el docker-compose.yml
DB_HOST=db
DB_PORT=5432

# --- Configuración Extra ---
LOG_LEVEL=INFO```

## Ejecución (Comandos Rápidos)

Este proyecto incluye un `Makefile` para facilitar las tareas comunes.

1. Construir y Levantar

Descarga las imágenes, compila dependencias y levanta el servidor en el puerto 8000.

```bash
make build
make up
```

2. Inicialización (Solo la primera vez)

```bash
# Crear tablas en la base de datos
make migrate

# Crear usuario administrador (Admin)
make load-data
```

3. Detener servicios

```bash
make down
```

## Calidad de Código y Tests

El proyecto cumple con los estándares de calidad requeridos (cobertura > 65% y PEP8).


|Comando   |Descripcion                                                |
|----------|-----------------------------------------------------------|
|make test | Ejecuta los tests unitarios y genera reporte de cobertura.|
|make lint | Verifica errores de estilo y bugs con Ruff.               |
|make fmt  | Formatea el código automáticamente con Black.             |

## Arquitectura y Producción

**Estructura de Settings**

- `core/settings/base.py`: Configuración común.
- `core/settings/dev.py`: Debug activado, consola de emails.
- `core/settings/prod.py`: Debug desactivado, seguridad HSTS/SSL, lectura estricta de variables de entorno.

**Docker Multi-Stage**

El Dockerfile utiliza dos etapas para generar una imagen final ligera y segura:

- Builder: Compila dependencias del sistema (gcc, libpq-dev).
- Runtime: Copia solo los binarios necesarios, usa un usuario no-root (appuser) y ejecuta Gunicorn.

## Endpoints y Documentación

La API es auto-documentada. Con el servidor corriendo, visita:

Swagger UI (Interactivo): `http://localhost:8000/api/docs/`

ReDoc (Lectura): `http://localhost:8000/api/redoc/`

Métricas Prometheus: `http://localhost:8000/metrics`

Health Check: `http://localhost:8000/healthz/`
