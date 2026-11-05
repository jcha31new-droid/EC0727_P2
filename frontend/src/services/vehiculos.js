
const API_URL = 'http://localhost:8000/api/vehiculos/';
const SOLICITUDES_URL = 'http://localhost:8000/api/solicitudes/';
const CONTACTO_URL = 'http://localhost:8000/api/contacto/';

export async function obtenerVehiculos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error('Error al consultar los vehículos');
    }

    const datos = await respuesta.json();
    return datos;

  } catch (error) {
    console.error('Error de conexión con Django:', error);
    throw error;
  }
}

export async function obtenerVehiculo(id) {
  try {
    const respuesta = await fetch(`${API_URL}${id}/`);

    if (!respuesta.ok) {
      throw new Error('Error al consultar el vehículo');
    }

    const datos = await respuesta.json();
    return datos;

  } catch (error) {
    console.error('Error al consultar el vehículo:', error);
    throw error;
  }
}

export async function registrarSolicitud(datos) {
  try {
    const respuesta = await fetch(SOLICITUDES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error('No fue posible registrar la solicitud');
    }

    return await respuesta.json();

  } catch (error) {
    console.error('Error al registrar la solicitud:', error);
    throw error;
  }
}

export async function registrarMensajeContacto(datos) {
  try {
    const respuesta = await fetch(CONTACTO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error('No fue posible enviar el mensaje de contacto');
    }

    return await respuesta.json();

  } catch (error) {
    console.error('Error al registrar el mensaje de contacto:', error);
    throw error;
  }
}

const AUTH_URL = 'http://localhost:8000/api/auth/';

export async function obtenerCSRF() {
  const respuesta = await fetch(`${AUTH_URL}csrf/`, {
    credentials: 'include'
  });

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el token CSRF');
  }

  return true;
}

export async function iniciarSesion(datos) {
  const token = document.cookie
    .split('; ')
    .find(fila => fila.startsWith('csrftoken='))
    ?.split('=')[1];

  const respuesta = await fetch(`${AUTH_URL}login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': token
    },
    body: JSON.stringify(datos)
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'Error al iniciar sesión');
  }

  return resultado;
}

export async function cerrarSesion() {
  const token = document.cookie
    .split('; ')
    .find(fila => fila.startsWith('csrftoken='))
    ?.split('=')[1];

  const respuesta = await fetch(`${AUTH_URL}logout/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': token
    }
  });

  if (!respuesta.ok) {
    throw new Error('No fue posible cerrar la sesión');
  }

  return await respuesta.json();
}