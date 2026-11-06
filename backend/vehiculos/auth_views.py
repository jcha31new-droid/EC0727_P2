from django.shortcuts import redirect
import json

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

@ensure_csrf_cookie
def obtener_csrf(request):
    return JsonResponse({
        'mensaje': 'Token CSRF generado',
        'csrfToken': get_token(request)
    })


@require_POST
def iniciar_sesion(request):
    try:
        datos = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'La solicitud no contiene datos válidos'},
            status=400
        )

    usuario = datos.get('username', '').strip()
    contrasena = datos.get('password', '')

    usuario_autenticado = authenticate(
        request,
        username=usuario,
        password=contrasena
    )

    if (
        usuario_autenticado is None
        or not usuario_autenticado.is_staff
        or not usuario_autenticado.is_active
    ):
        return JsonResponse(
            {'error': 'Usuario o contraseña incorrectos'},
            status=401
        )

    login(request, usuario_autenticado)

    return JsonResponse({
        'mensaje': 'Inicio de sesión exitoso',
        'redirect_url': '/admin/'
    })


@require_POST
def cerrar_sesion(request):
    logout(request)
    return JsonResponse({
        'mensaje': 'Sesión cerrada correctamente'
    })

def cerrar_sesion_admin(request):
    logout(request)
    return redirect('https://automarket-ec0727.netlify.app/')