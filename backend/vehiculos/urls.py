
from rest_framework.routers import DefaultRouter
from .views import VehiculoViewSet, SolicitudViewSet, MensajeContactoViewSet

router = DefaultRouter()

router.register('vehiculos', VehiculoViewSet, basename='vehiculo')
router.register('solicitudes', SolicitudViewSet, basename='solicitud')
router.register('contacto', MensajeContactoViewSet, basename='contacto')

urlpatterns = router.urls
