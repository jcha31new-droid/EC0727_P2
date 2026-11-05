from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from vehiculos import auth_views

urlpatterns = [
    path(
        'admin/logout/',
        auth_views.cerrar_sesion_admin,
        name='admin_logout_personalizado'
    ),
    path('admin/', admin.site.urls),
    path('api/auth/', include('vehiculos.auth_urls')),
    path('api/', include('vehiculos.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )