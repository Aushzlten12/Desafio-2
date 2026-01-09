FROM python:3.12-slim as builder

WORKDIR /app

# Instalamos dependencias de sistema necesarias para compilar (gcc, libpq)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Instalamos las librerías en una carpeta local (/install)
RUN pip install --prefix=/install -r requirements.txt

# Runtime (Imagen final ligera)
FROM python:3.12-slim

WORKDIR /app

# Instalamos solo libpq (cliente postgres) sin gcc
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copiamos las librerías compiladas desde la etapa builder
COPY --from=builder /install /usr/local

# Copiamos el código
COPY . .

# Creamos un usuario no-root por seguridad 
RUN adduser --disabled-password --no-create-home appuser
USER appuser

EXPOSE 8000

# Usamos Gunicorn como servidor WSGI [cite: 181]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
