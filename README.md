# Sistema de Gestión Full Stack (Django + Angular)

Este repositorio contiene una aplicación web completa modularizada en Frontend (Angular 17+) y Backend (Django REST Framework), totalmente contenedorizada con **Docker** y orquestada mediante un **Makefile** para facilitar el desarrollo.

---

## Infraestructura Docker

El proyecto utiliza **Docker Compose** para levantar 3 servicios interconectados. La configuración se encuentra en el archivo `docker-compose.yml`.

### Servicios

| Servicio | Tecnología | Puerto (Host) | Descripción |
| :--- | :--- | :--- | :--- |
| **`frontend`** | Nginx (Alpine) | `80` (http://localhost) | Servidor web de producción. Sirve los archivos estáticos compilados de Angular y maneja el enrutamiento. |
| **`backend`** | Python 3.11 + Django | `8000` | API REST. Se conecta a la base de datos y expone los endpoints. Incluye *Hot-Reload* para desarrollo. |
| **`db`** | PostgreSQL 15 | `5432` | Base de datos relacional. Los datos persisten en un volumen de Docker (`postgres_data`) para no perderse al reiniciar. |

### Volúmenes y Redes
* **Persistencia:** Se utiliza un volumen llamado `postgres_data` para asegurar que la base de datos no se borre al apagar los contenedores.
* **Red:** Todos los servicios se comunican dentro de una red interna creada automáticamente por Docker Compose.

---

## Automatización con Makefile

Para evitar escribir comandos largos de Docker repetitivamente, se incluye un archivo `Makefile` en la raíz.

### Comandos Principales

| Comando | Acción | Cuándo usarlo |
| :--- | :--- | :--- |
| `make up` | Levanta todo el sistema en segundo plano. | Para iniciar el trabajo diario. |
| `make build` | Reconstruye todas las imágenes desde cero y levanta el sistema. | Si agregaste librerías nuevas o el sistema falla. |
| `make down` | Detiene y elimina los contenedores. | Al terminar de trabajar. |
| `make logs` | Muestra los logs de todos los servicios en tiempo real. | Para depurar errores. |

### Comandos de Actualización Rápida
*Estos comandos son útiles cuando modificas código y quieres ver los cambios reflejados.*

| Comando | Acción |
| :--- | :--- |
| **`make update-front`** | Reconstruye solo el contenedor de **Angular**. Úsalo cuando modifiques HTML, CSS o TypeScript y no veas los cambios. |
| **`make update-back`** | Reconstruye solo el contenedor de **Django**. Úsalo si instalas nuevas librerías (`pip install`) o cambias variables de entorno. |

### Utilidades de Backend
| Comando | Acción |
| :--- | :--- |
| `make migrations` | Ejecuta `makemigrations` y `migrate` dentro del contenedor. |
| `make superuser` | Crea un superusuario para entrar al panel de administración. |
| `make shell-back` | Abre una terminal dentro del contenedor de Django. |
| `make clean-data` | ⚠️ **Borra la base de datos** y volúmenes. Deja el sistema como nuevo. |

---

## 🏁 Guía de Inicio Rápido

### 1. Requisitos Previos
* Tener instalado **Docker** y **Docker Desktop**.
* (Opcional en Windows) Tener **Make** instalado (o usar WSL/Git Bash).

### 2. Configuración Inicial
Asegúrate de tener el archivo `.env` en la raíz con las credenciales de base de datos (se provee un ejemplo en el repo).

### 3. Ejecución
Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# 1. Levantar el sistema
make build

# 2. Crear las tablas en la base de datos (solo la primera vez)
make migrations

# 3. Crear un usuario administrador (opcional)
make superuser
