from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)  # Quité TokenObtainPairView de aquí

from api.views import MyTokenObtainPairView  # <--- Asegúrate de importar esto
from api.views import PersonViewSet, ProductViewSet, healthz, readyz

router = DefaultRouter()
router.register(r"persons", PersonViewSet)
router.register(r"products", ProductViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(router.urls)),
    path(
        "api/v1/auth/login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    # --------------------------------
    path("api/v1/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("healthz/", healthz),
    path("readyz/", readyz),
    path("", include("django_prometheus.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
