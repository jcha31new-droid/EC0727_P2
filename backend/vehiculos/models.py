from django.db import models


class Vehiculo(models.Model):

    CATEGORIAS = [
        ('Sedan', 'Sedán'),
        ('Hatchback', 'Hatchback'),
        ('SUV', 'SUV'),
    ]

    TRANSMISIONES = [
        ('Manual', 'Manual'),
        ('Automatica', 'Automática'),
    ]

    DISPONIBILIDADES = [
        ('Disponible', 'Disponible'),
        ('Vendido', 'Vendido'),
    ]

    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS)
    anio = models.PositiveSmallIntegerField()
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    kilometraje = models.PositiveIntegerField()

    transmision = models.CharField(
        max_length=15,
        choices=TRANSMISIONES
    )

    fotografia = models.ImageField(upload_to='vehiculos/')

    disponibilidad = models.CharField(
        max_length=15,
        choices=DISPONIBILIDADES,
        default='Disponible'
    )

    class Meta:
        verbose_name = 'Vehículo'
        verbose_name_plural = 'Inventario de vehículos'

    def __str__(self):
        return f'{self.marca} {self.modelo} ({self.anio})'


class Solicitud(models.Model):

    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Atendida', 'Atendida'),
    ]

    vehiculo = models.ForeignKey(
        Vehiculo,
        on_delete=models.PROTECT,
        related_name='solicitudes'
    )

    nombre = models.CharField(max_length=100, blank=True)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField(blank=True)
    mensaje = models.TextField(blank=True)

    fecha_registro = models.DateTimeField(auto_now_add=True)

    estado = models.CharField(
        max_length=15,
        choices=ESTADOS,
        default='Pendiente'
    )

    class Meta:
        verbose_name = 'Solicitud'
        verbose_name_plural = 'Solicitudes'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f'Solicitud {self.id} - {self.telefono}'


class MensajeContacto(models.Model):

    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField(blank=True)
    mensaje = models.TextField()

    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Mensaje de contacto'
        verbose_name_plural = 'Mensajes de contacto'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f'Mensaje {self.id} - {self.nombre}'