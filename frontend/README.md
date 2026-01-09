# Frontend - Sistema de Gestión (Angular)

Este directorio contiene el código fuente de la interfaz de usuario, desarrollada con **Angular 17+** (Standalone Components) y **Bootstrap 5**.

La aplicación consume una API REST (Django) y maneja autenticación vía JWT, guardias de seguridad y gestión de errores.

---

## Requisitos Previos

* **Node.js**: Versión 18.13.0 o superior.
* **Angular CLI**: Instalado globalmente (`npm install -g @angular/cli`).

---

## Entornos de Ejecución

### 1. Desarrollo Local (Dev Mode)
Ideal para programar día a día. Usa el servidor de desarrollo de Angular con *Hot-Reload*.

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar el servidor:**
    ```bash
    ng serve
    ```

3.  **Acceder:** Abre [http://localhost:4200](http://localhost:4200).

> **Nota sobre CORS:** En este modo, la aplicación espera que el Backend esté corriendo en `http://localhost:8000`. Asegúrate de que Django tenga `http://localhost:4200` en su lista de `CORS_ALLOWED_ORIGINS`.

---

### 2. Producción (Docker + Nginx)
Simula el entorno real. Compila el código Angular y lo sirve estáticamente usando un servidor Nginx ligero.

1.  **Construir la imagen:**
    ```bash
    docker build -t mi-frontend-prod .
    ```

2.  **Correr el contenedor:**
    ```bash
    docker run -p 80:80 mi-frontend-prod
    ```

3.  **Acceder:** Abre [http://localhost](http://localhost).

> **Funcionamiento:** El `Dockerfile` utiliza "Multi-stage builds". Primero usa una imagen de Node para compilar (`npm run build --prod`) y luego copia los archivos generados (`dist/`) a una imagen de Nginx.

---

## Configuración de Environments

La aplicación cambia automáticamente la URL de la API según el entorno:

* **Desarrollo (`src/environments/environment.ts`):**
    * Se usa al correr `ng serve`.
    * `apiUrl`: `'http://localhost:8000/api/v1'`

* **Producción (`src/environments/environment.prod.ts`):**
    * Se usa al correr `ng build --configuration production` (o en Docker).
    * `apiUrl`: `'http://localhost:8000/api/v1'` (o tu dominio real).

---

## Testing y Calidad

### Unit Tests
Ejecuta las pruebas unitarias con Karma y Jasmine.
```bash
  ng test
```

## Estructura del Proyecto

El código sigue una arquitectura modular y basada en componentes independientes (Standalone):

```plaintext
src/app/
├── components/       # Vistas y componentes reutilizables
│   ├── dashboard/    # Pantalla principal con estadísticas
│   ├── login/        # Formulario de autenticación
│   ├── person-list/  # CRUD de personas
│   └── ...
├── guards/           # Protección de rutas (AuthGuard)
├── interceptors/     # Interceptor HTTP para inyectar Token JWT
├── services/         # Comunicación con la API (ApiService)
├── app.routes.ts     # Definición de rutas y navegación
└── app.config.ts     # Configuración global (HttpClient, etc.)
```
