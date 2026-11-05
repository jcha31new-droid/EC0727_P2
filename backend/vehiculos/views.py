
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Vehiculo, Solicitud, MensajeContacto
from .serializers import (
    VehiculoSerializer,
    SolicitudSerializer,
    MensajeContactoSerializer
)
from .permissions import IsAdminOrReadOnly


class VehiculoViewSet(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return Vehiculo.objects.filter(disponibilidad='Disponible')


class SolicitudViewSet(viewsets.ModelViewSet):
    serializer_class = SolicitudSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        return Solicitud.objects.select_related('vehiculo').all()

    def perform_create(self, serializer):
        serializer.save(estado='Pendiente')

class MensajeContactoViewSet(viewsets.ModelViewSet):
    queryset = MensajeContacto.objects.all()
    serializer_class = MensajeContactoSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'options', 'head']
