build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

logs:
	docker compose logs -f web

test:
	docker compose exec web coverage run --source='.' manage.py test api
	docker compose exec web coverage report

lint:
	docker compose exec web pip install ruff black
	docker compose exec web ruff check .
	docker compose exec web black --check .

fmt:
	docker compose exec web black .

load-data:
	docker compose exec web python manage.py createsuperuser
