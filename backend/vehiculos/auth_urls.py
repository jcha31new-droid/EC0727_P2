from django.urls import path
from . import auth_views

urlpatterns = [
    path('csrf/', auth_views.obtener_csrf, name='obtener_csrf'),
    path('login/', auth_views.iniciar_sesion, name='iniciar_sesion'),
    path('logout/', auth_views.cerrar_sesion, name='cerrar_sesion'),
]