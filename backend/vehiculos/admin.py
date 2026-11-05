from django.contrib.auth.models import Group, User
from django.contrib import admin
from django.utils.html import format_html
from .models import Vehiculo, Solicitud, MensajeContacto

# Ocultar visualmente la sección de usuarios y grupos
_get_app_list = admin.site.get_app_list

def get_app_list_personalizada(request, app_label=None):
    app_list = _get_app_list(request, app_label)

    return [
        app for app in app_list
        if app['app_label'] != 'auth'
    ]

admin.site.get_app_list = get_app_list_personalizada

admin.site.site_header = 'AutoMarket | Panel administrativo'
admin.site.site_title = 'AutoMarket'
admin.site.index_title = 'Administración de AutoMarket'


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    actions = None
    list_editable = ('disponibilidad',)

    list_display = (
        'mostrar_fotografia',
        'marca',
        'modelo',
        'categoria',
        'mostrar_anio',
        'mostrar_precio',
        'kilometraje',
        'transmision',
        'disponibilidad',
    )

    search_fields = ('marca', 'modelo')
    list_filter = ('disponibilidad',)

    @admin.display(description='Fotografía')
    def mostrar_fotografia(self, obj):
        if obj.fotografia:
            return format_html(
                '<img src="{}" width="80" height="55" '
                'style="object-fit: cover; border-radius: 5px;" />',
                obj.fotografia.url
            )
        return 'Sin fotografía'

    @admin.display(description='Precio')
    def mostrar_precio(self, obj):
        return f'${obj.precio:,.2f}'

    @admin.display(description='AÑO')
    def mostrar_anio(self, obj):
        return obj.anio


@admin.register(Solicitud)
class SolicitudAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'nombre',
        'telefono',
        'correo',
        'vehiculo',
        'fecha_registro',
        'estado',
    )

    search_fields = (
        'nombre',
        'telefono',
        'correo',
        'vehiculo__marca',
        'vehiculo__modelo',
    )

    list_filter = ('estado', 'fecha_registro')

    readonly_fields = ('fecha_registro',)

    list_editable = ('estado',)


@admin.register(MensajeContacto)
class MensajeContactoAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'nombre',
        'telefono',
        'correo',
        'fecha_registro',
    )

    search_fields = (
        'nombre',
        'telefono',
        'correo',
        'mensaje',
    )

    list_filter = ('fecha_registro',)

    readonly_fields = (
        'nombre',
        'telefono',
        'correo',
        'mensaje',
        'fecha_registro',
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return False
