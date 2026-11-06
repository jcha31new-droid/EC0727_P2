
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
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

    re_path(
        r'^media/(?P<path>.*)$',
        serve,
        {'document_root': settings.MEDIA_ROOT}
    ),
]
