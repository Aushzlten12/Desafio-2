DOCKER_COMPOSE = docker compose

.PHONY: help up build down logs

help: 
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up:
	$(DOCKER_COMPOSE) up -d
	@echo "🚀 Sistema corriendo en http://localhost"

build:
	$(DOCKER_COMPOSE) up -d --build
	@echo "🏗️  Todo reconstruido y listo."

down: ## Detiene y elimina los contenedores
	$(DOCKER_COMPOSE) down
	@echo "🛑 Sistema detenido."

logs: ## Muestra los logs de todos los servicios en tiempo real
	$(DOCKER_COMPOSE) logs -f


.PHONY: update-front update-back

update-front: 
	$(DOCKER_COMPOSE) build --no-cache frontend 
	$(DOCKER_COMPOSE) up -d frontend
	@echo "🎨 Frontend actualizado."

update-back:
	$(DOCKER_COMPOSE) up -d --build backend
	@echo "🐍 Backend actualizado."

# -----------------------------------------------------------------------------
# UTILIDADES DE DJANGO (Backend)
# -----------------------------------------------------------------------------

.PHONY: migrations superuser shell-back

migrations: ## Ejecuta makemigrations y migrate dentro del contenedor
	$(DOCKER_COMPOSE) exec backend python manage.py makemigrations
	$(DOCKER_COMPOSE) exec backend python manage.py migrate
	@echo "🗄️  Base de datos actualizada."

superuser: ## Crea un superusuario de Django
	$(DOCKER_COMPOSE) exec backend python manage.py createsuperuser

shell-back: ## Entra a la terminal del contenedor de Backend
	$(DOCKER_COMPOSE) exec backend sh

# -----------------------------------------------------------------------------
# LIMPIEZA
# -----------------------------------------------------------------------------

.PHONY: clean-data

clean-data: 
	$(DOCKER_COMPOSE) down -v
	@echo "🗑️  Volúmenes borrados. Sistema como nuevo."
