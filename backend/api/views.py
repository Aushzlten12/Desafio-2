import django_filters
from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from api.models import Person, Product
from api.serializers import (
    MyTokenObtainPairSerializer,
    PersonSerializer,
    ProductSerializer,
)


class ProductFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["sku", "price_min", "price_max"]


class PersonFilter(django_filters.FilterSet):
    email = django_filters.CharFilter(field_name="email", lookup_expr="icontains")
    last_name = django_filters.CharFilter(
        field_name="last_name", lookup_expr="icontains"
    )

    class Meta:
        model = Person
        fields = ["email", "last_name"]


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all().order_by("-created_at")
    serializer_class = PersonSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]

    # Permite filtrar usando: /persons/?email=admin@mail.com&last_name=Perez
    filterset_class = PersonFilter

    # Esto habilita la búsqueda general (?search=juan)
    search_fields = ["email", "last_name"]

    # Esto habilita el ordenamiento (?ordering=-created_at)
    ordering_fields = ["created_at"]

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_class = ProductFilter
    search_fields = ["name"]
    ordering_fields = ["price", "created_at"]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def healthz(request):
    return Response({"status": "ok"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def readyz(request):
    try:
        connection.ensure_connection()
        return Response({"database": "ready"}, status=status.HTTP_200_OK)
    except Exception:
        return Response(
            {"database": "error"}, status=status.HTTP_503_SERVICE_UNAVAILABLE
        )


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
