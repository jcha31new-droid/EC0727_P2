
const API_URL = 'https://ec0727p2-production.up.railway.app/api/vehiculos/';
const SOLICITUDES_URL = 'https://ec0727p2-production.up.railway.app/api/solicitudes/';
const CONTACTO_URL = 'https://ec0727p2-production.up.railway.app/api/contacto/';
const AUTH_URL = 'https://ec0727p2-production.up.railway.app/api/auth/';
let csrfToken = null;

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

export async function obtenerCSRF() {
  const respuesta = await fetch(`${AUTH_URL}csrf/`, {
    credentials: 'include'
  });

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el token CSRF');
  }

  const datos = await respuesta.json();
  csrfToken = datos.csrfToken;

  return true;
}

export async function iniciarSesion(datos) {
  if (!csrfToken) {
    await obtenerCSRF();
  }

  const respuesta = await fetch(`${AUTH_URL}login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
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
  await obtenerCSRF();

  const respuesta = await fetch(`${AUTH_URL}logout/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken
    }
  });

  if (!respuesta.ok) {
    throw new Error('No fue posible cerrar la sesión');
  }

  return await respuesta.json();
}
