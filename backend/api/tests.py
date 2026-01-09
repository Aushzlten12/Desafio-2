from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Person, Product


class BaseTestCase(APITestCase):
    """Configuración base para autenticación y datos comunes"""

    def setUp(self):
        # 1. Creamos un usuario para probar la autenticación [cite: 142]
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )

        # 2. Obtenemos el Token JWT
        url_login = reverse("token_obtain_pair")
        resp = self.client.post(
            url_login, {"username": "testuser", "password": "password123"}
        )
        self.token = resp.data["access"]

        # 3. Configuramos el cliente para usar el token en todas las peticiones
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")


class PersonTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.list_url = reverse("person-list")
        self.person_data = {
            "first_name": "Juan",
            "last_name": "Perez",
            "email": "juan@test.com",
        }

    def test_create_person(self):
        """Prueba crear persona (POST)"""
        response = self.client.post(self.list_url, self.person_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Person.objects.count(), 1)

    def test_list_persons_and_filter(self):
        """Prueba listar y filtrar por email (GET) - [cite: 127]"""
        Person.objects.create(**self.person_data)
        Person.objects.create(
            first_name="Maria", last_name="Gomez", email="maria@test.com"
        )

        # Filtrar por email
        response = self.client.get(f"{self.list_url}?search=maria")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["email"], "maria@test.com")

    def test_update_person(self):
        """Prueba actualizar persona (PUT/PATCH) - [cite: 129]"""
        person = Person.objects.create(**self.person_data)
        url = reverse("person-detail", args=[person.id])

        update_data = {
            "first_name": "Juan Actualizado",
            "last_name": "Perez",
            "email": "juan@test.com",
        }
        response = self.client.put(url, update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Juan Actualizado")

    def test_delete_person(self):
        """Prueba eliminar persona (DELETE) - [cite: 130]"""
        person = Person.objects.create(**self.person_data)
        url = reverse("person-detail", args=[person.id])

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Person.objects.count(), 0)


class ProductTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.list_url = reverse("product-list")
        # Creamos productos con diferentes precios para probar filtros
        self.p1 = Product.objects.create(name="Mouse", sku="SKU001", price=10.00)
        self.p2 = Product.objects.create(name="Teclado", sku="SKU002", price=50.00)
        self.p3 = Product.objects.create(name="Monitor", sku="SKU003", price=100.00)

    def test_create_product(self):
        """Prueba crear producto (POST) - [cite: 133]"""
        data = {"name": "Laptop", "sku": "SKU004", "price": 1500.00}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_filter_product_price_range(self):
        """Prueba filtro avanzado de rango de precios (GET) - [cite: 134]"""
        # Queremos productos entre $40 y $60 (Debería traer solo el Teclado de $50)
        url = f"{self.list_url}?price_min=40&price_max=60"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["sku"], "SKU002")

    def test_search_product(self):
        """Prueba búsqueda general por nombre (GET q) - [cite: 134]"""
        response = self.client.get(f"{self.list_url}?search=Monitor")
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "Monitor")


class SecurityAndHealthTests(APITestCase):
    def test_health_checks(self):
        """Prueba endpoints de monitoreo - [cite: 155]"""
        self.assertEqual(self.client.get("/healthz/").status_code, 200)
        self.assertEqual(self.client.get("/readyz/").status_code, 200)

    def test_unauthorized_write(self):
        """Prueba que un usuario anónimo NO pueda escribir (Auth) - [cite: 142]"""
        # No usamos login aquí
        response = self.client.post(reverse("person-list"), {"name": "Hacker"})
        # Debe rechazarlo con 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
