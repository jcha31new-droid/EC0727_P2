
from rest_framework import serializers
from .models import Vehiculo, Solicitud, MensajeContacto

class VehiculoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vehiculo
        fields = '__all__'


class SolicitudSerializer(serializers.ModelSerializer):

    class Meta:
        model = Solicitud
        fields = '__all__'
        read_only_fields = ('id', 'fecha_registro', 'estado')

class MensajeContactoSerializer(serializers.ModelSerializer):

    class Meta:
        model = MensajeContacto
        fields = '__all__'
        read_only_fields = ('id', 'fecha_registro')