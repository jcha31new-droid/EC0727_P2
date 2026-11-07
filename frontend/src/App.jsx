
  import { useEffect, useState } from 'react'
  import {
    obtenerVehiculos,
    obtenerVehiculo,
    registrarSolicitud,
    registrarMensajeContacto,
    iniciarSesion,
    cerrarSesion
  } from './services/vehiculos'
  import './App.css'

  function App() {
    const [vehiculos, setVehiculos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
    const [cargandoDetalle, setCargandoDetalle] = useState(false)

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [mensajeFormulario, setMensajeFormulario] = useState('')
    const [solicitudRegistrada, setSolicitudRegistrada] = useState(null)

    const [mostrarLoginAdmin, setMostrarLoginAdmin] = useState(false)
    const [usuarioAdmin, setUsuarioAdmin] = useState('')
    const [contrasenaAdmin, setContrasenaAdmin] = useState('')
    const [errorLoginAdmin, setErrorLoginAdmin] = useState('')
    const [cargandoLoginAdmin, setCargandoLoginAdmin] = useState(false)

    const [formulario, setFormulario] = useState({
      nombre: '',
      telefono: '',
      correo: '',
      mensaje: ''
    })

    useEffect(() => {
      async function cargarVehiculos() {
        try {
          const datos = await obtenerVehiculos()
          setVehiculos(datos)
        } catch {
          setError('No fue posible cargar los vehículos.')
        } finally {
          setCargando(false)
        }
      }

      cargarVehiculos()
    }, [])

    async function verDetalles(id) {
      try {
        setCargandoDetalle(true)
        setError('')

        const datos = await obtenerVehiculo(id)
        setVehiculoSeleccionado(datos)

        window.scrollTo(0, 0)
      } catch {
        setError('No fue posible cargar los detalles del vehículo.')
      } finally {
        setCargandoDetalle(false)
      }
    }

    function volverCatalogo() {
      setVehiculoSeleccionado(null)
      setError('')
      setMostrarFormulario(false)
      setMensajeFormulario('')
      setSolicitudRegistrada(null)
      setFormulario({
        nombre: '',
        telefono: '',
        correo: '',
        mensaje: ''
      })
    }

    function abrirLoginAdmin(evento) {
      evento.preventDefault()
      setMostrarLoginAdmin(true)
      setErrorLoginAdmin('')
      setUsuarioAdmin('')
      setContrasenaAdmin('')
      window.scrollTo(0, 0)
    }

    function volverSitioPublico() {
      setMostrarLoginAdmin(false)
      setErrorLoginAdmin('')
      setUsuarioAdmin('')
      setContrasenaAdmin('')
      window.scrollTo(0, 0)
    }

    async function manejarLoginAdmin(evento) {
  evento.preventDefault()

  try {
    setCargandoLoginAdmin(true)
    setErrorLoginAdmin('')

    await iniciarSesion({
      username: usuarioAdmin,
      password: contrasenaAdmin
    })

    window.location.href = 'https://ec0727p2-production.up.railway.app/admin/'

  } catch (error) {
    setErrorLoginAdmin(
      error.message || 'No fue posible iniciar sesión.'
    )
  } finally {
    setCargandoLoginAdmin(false)
  }
}

    function manejarCambio(evento) {
      const { name, value } = evento.target

      setFormulario({
        ...formulario,
        [name]: value
      })
    }

    async function enviarSolicitud(evento) {
      evento.preventDefault()

      try {
        setEnviando(true)
        setMensajeFormulario('')
        setSolicitudRegistrada(null)

        const datos = {
          ...formulario,
          vehiculo: vehiculoSeleccionado.id
        }

        const respuesta = await registrarSolicitud(datos)

        setSolicitudRegistrada(respuesta)
        setMensajeFormulario('¡Tu solicitud fue registrada correctamente!')

        setFormulario({
          nombre: '',
          telefono: '',
          correo: '',
          mensaje: ''
        })

      } catch {
        setMensajeFormulario(
          'No fue posible registrar tu solicitud. Intenta nuevamente.'
        )
      } finally {
        setEnviando(false)
      }
    }
    async function enviarMensajeContacto(evento) {
    evento.preventDefault()

    const formularioContacto = evento.target

    const datos = {
      nombre: formularioContacto.nombre.value,
      telefono: formularioContacto.telefono.value,
      correo: formularioContacto.correo.value,
      mensaje: formularioContacto.mensaje.value
    }

    try {
      await registrarMensajeContacto(datos)

      alert('¡Gracias por contactarnos! Hemos recibido tu mensaje.')
      formularioContacto.reset()

    } catch {
      alert('No fue posible enviar tu mensaje. Intenta nuevamente.')
    }
  }

    function mostrarFecha(fecha) {
      return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Mexico_City'
      }).format(new Date(fecha))
    }

    return (
      <div className="automarket">

        <header className="header">
    <a
      href="#inicio"
      className="logo"
      onClick={mostrarLoginAdmin ? volverSitioPublico : volverCatalogo}
    >
      AUTO<span>MARKET</span>
    </a>

    {mostrarLoginAdmin ? (
      <button
        className="btn-regresar"
        onClick={volverSitioPublico}
      >
        ← VOLVER AL SITIO
      </button>
    ) : (
    <nav className="nav-menu">
      <a href="#inicio" onClick={volverCatalogo}>Inicio</a>
      <a href="#catalogo" onClick={volverCatalogo}>Catálogo</a>
      <a href="#comparativa" onClick={volverCatalogo}>Comparativa</a>
      <a href="#nosotros" onClick={volverCatalogo}>Nosotros</a>
      <a href="#contacto" onClick={volverCatalogo}>Contacto</a>
      <a href="#" onClick={abrirLoginAdmin}>Acceso administrativo</a>
    </nav>
    )}
  </header>

        <main>

          {mostrarLoginAdmin ? (

    <section className="login-admin-section">

      <div className="login-admin-card">

        <h1>Acceso administrativo</h1>

        <p>
          Ingresa tus credenciales para acceder al panel de administración.
        </p>

        <form onSubmit={manejarLoginAdmin}>

          <div>
            <label htmlFor="usuario-admin">Usuario</label>
            <input
              type="text"
              id="usuario-admin"
              value={usuarioAdmin}
              onChange={(evento) => setUsuarioAdmin(evento.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="contrasena-admin">Contraseña</label>
            <input
              type="password"
              id="contrasena-admin"
              value={contrasenaAdmin}
              onChange={(evento) => setContrasenaAdmin(evento.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {errorLoginAdmin && (
            <p className="error-login-admin">
              {errorLoginAdmin}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={cargandoLoginAdmin}
          >
            {cargandoLoginAdmin ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
          </button>

        </form>

      </div>

    </section>

  ) : vehiculoSeleccionado ? (

            <section className="detalle-section">

              <button
                className="btn-regresar"
                onClick={volverCatalogo}
              >
                ← VOLVER AL CATÁLOGO
              </button>

              <div className="detalle-vehiculo">

                <div className="detalle-imagen">
                  <img
                    src={vehiculoSeleccionado.fotografia}
                    alt={`${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`}
                  />
                </div>

                <div className="detalle-info">

                  <span className="vehiculo-categoria">
                    {vehiculoSeleccionado.categoria}
                  </span>

                  <h1>
                    {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
                  </h1>

                  <p className="vehiculo-precio">
                    ${Number(vehiculoSeleccionado.precio).toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>

                  <div className="detalle-datos">
                    <p><strong>Año:</strong> {vehiculoSeleccionado.anio}</p>
                    <p>
                      <strong>Kilometraje:</strong>{' '}
                      {Number(vehiculoSeleccionado.kilometraje).toLocaleString('es-MX')} km
                    </p>
                    <p>
                      <strong>Transmisión:</strong> {vehiculoSeleccionado.transmision}
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => {
                      setMostrarFormulario(!mostrarFormulario)
                      setMensajeFormulario('')
                      setSolicitudRegistrada(null)
                    }}
                  >
                    SOLICITAR INFORMACIÓN
                  </button>

                </div>
              </div>

              {mostrarFormulario && (
                <section className="formulario-solicitud">

                  <h2>Solicitar información</h2>

                  <p>
                    Completa el siguiente formulario y nos pondremos en contacto contigo.
                  </p>

                  <form onSubmit={enviarSolicitud}>

                    <div>
                      <label htmlFor="nombre">Nombre completo</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        placeholder="Escribe tu nombre"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefono">Teléfono *</label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={manejarCambio}
                        placeholder="Escribe tu teléfono"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="correo">Correo electrónico</label>
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formulario.correo}
                        onChange={manejarCambio}
                        placeholder="Escribe tu correo electrónico"
                      />
                    </div>

                    <div>
                      <label htmlFor="mensaje">Mensaje</label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        value={formulario.mensaje}
                        onChange={manejarCambio}
                        placeholder="¿Qué información deseas conocer?"
                        rows="4"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={enviando}
                    >
                      {enviando ? 'ENVIANDO...' : 'ENVIAR SOLICITUD'}
                    </button>

                  </form>

                  {mensajeFormulario && (
                    <p className="mensaje-solicitud">
                      {mensajeFormulario}
                    </p>
                  )}

                  {solicitudRegistrada && (
                    <div className="confirmacion-solicitud">
                      <p>
                        <strong>Número de solicitud:</strong>{' '}
                        {solicitudRegistrada.id}
                      </p>
                      <p>
                        <strong>Fecha de registro:</strong>{' '}
                        {mostrarFecha(solicitudRegistrada.fecha_registro)}
                      </p>
                      <p>
                        <strong>Estado:</strong>{' '}
                        {solicitudRegistrada.estado}
                      </p>
                    </div>
                  )}

                </section>
              )}

            </section>

          ) : (

            <>
              <section className="hero-section" id="inicio">
                <div className="hero-content">
                  <h1>
                    Bienvenido a
                    <br />
                    Auto<span>Market</span>
                  </h1>

                  <div className="hero-line"></div>

                  <p>
                    Encuentra tu próximo automóvil seminuevo.
                  </p>

                  <a href="#catalogo" className="btn-primary">
                    VER CATÁLOGO
                  </a>
                </div>
              </section>

              <section className="catalogo-section" id="catalogo">

                <div className="section-heading">
                  <h2>Catálogo de vehículos</h2>
                  <p>Conoce nuestra selección de automóviles seminuevos.</p>
                </div>

                {cargando && (
                  <p className="catalogo-mensaje">Cargando vehículos...</p>
                )}

                {error && (
                  <p className="catalogo-mensaje">{error}</p>
                )}

                {!cargando && !error && vehiculos.length === 0 && (
                  <p className="catalogo-mensaje">
                    Actualmente no tenemos vehículos disponibles.
                  </p>
                )}

                {!cargando && !error && vehiculos.length > 0 && (
                  <div className="vehiculos-grid">

                    {vehiculos.map((vehiculo) => (
                      <article className="vehiculo-card" key={vehiculo.id}>

                        <div className="vehiculo-imagen">
                          <img
                            src={vehiculo.fotografia}
                            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                          />
                        </div>

                        <div className="vehiculo-info">

                          <span className="vehiculo-categoria">
                            {vehiculo.categoria}
                          </span>

                          <h3>
                            {vehiculo.marca} {vehiculo.modelo}
                          </h3>

                          <p className="vehiculo-precio">
                            ${Number(vehiculo.precio).toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>

                          <div className="vehiculo-datos">
                            <span>Año: {vehiculo.anio}</span>
                            <span>
                              Kilometraje: {Number(vehiculo.kilometraje).toLocaleString('es-MX')} km
                            </span>
                            <span>Transmisión: {vehiculo.transmision}</span>
                          </div>

                          <button
                            className="btn-primary"
                            onClick={() => verDetalles(vehiculo.id)}
                            disabled={cargandoDetalle}
                          >
                            VER DETALLES
                          </button>

                        </div>
                      </article>
                    ))}

                  </div>
                )}
              </section>

              <section className="comparativa-section" id="comparativa">

    <div className="section-heading">
      <h2>Comparativa de vehículos disponibles</h2>
      <p>Compara las características de nuestros automóviles seminuevos.</p>
    </div>

    {!cargando && !error && vehiculos.length === 0 && (
      <p className="catalogo-mensaje">
        Actualmente no tenemos vehículos disponibles para comparar.
      </p>
    )}

    {!cargando && !error && vehiculos.length > 0 && (
      <div className="tabla-vehiculos-container">

        <div className="tabla-scroll">
          <table className="tabla-vehiculos">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Categoría</th>
                <th>Año</th>
                <th>Precio</th>
                <th>Kilometraje</th>
                <th>Transmisión</th>
              </tr>
            </thead>

            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.categoria}</td>
                  <td>{vehiculo.anio}</td>
                  <td>
                    ${Number(vehiculo.precio).toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td>
                    {Number(vehiculo.kilometraje).toLocaleString('es-MX')} km
                  </td>
                  <td>{vehiculo.transmision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    )}

  </section>

              <section className="nosotros-section" id="nosotros">

                <div className="section-heading">
                  <h2>Conoce AutoMarket</h2>
                  <p>Más que automóviles, ofrecemos confianza y tranquilidad en cada elección.</p>
                </div>

                <div className="nosotros-grid">

                  <article className="nosotros-card">
                    <div className="nosotros-icon">🚘</div>
                    <h3>Quiénes somos</h3>
                    <p>
                      Somos una empresa dedicada a la compra y venta de
                      automóviles seminuevos, comprometida con ofrecer
                      opciones que se adapten a las necesidades de nuestros clientes.
                    </p>
                  </article>

                  <article className="nosotros-card">
                    <div className="nosotros-icon">🤝</div>
                    <h3>Nuestro compromiso</h3>
                    <p>
                      Trabajamos con transparencia, responsabilidad y atención
                      personalizada para brindar una experiencia de compra
                      confiable y satisfactoria.
                    </p>
                  </article>

                  <article className="nosotros-card">
                    <div className="nosotros-icon">🎯</div>
                    <h3>Nuestro objetivo</h3>
                    <p>
                      Facilitar la búsqueda y adquisición de vehículos
                      seminuevos, ofreciendo información clara y opciones
                      de calidad para nuestros clientes.
                    </p>
                  </article>

                </div>

                          </section>

              {/* Sección multimedia: video */}
              <section className="multimedia-section" id="multimedia">

                <div className="section-heading">
                  <h2>AutoMarket en movimiento</h2>
                  <p>Conoce más sobre el mundo de los vehículos seminuevos.</p>
                </div>

                <div className="video-container">
                  <video controls preload="metadata">
                    <source
                      src="/videos/automarket-demo.mp4"
                      type="video/mp4"
                    />
                    Tu navegador no admite la reproducción de video.
                  </video>
                </div>

              </section>

              <section className="contacto-section" id="contacto">

                <div className="section-heading">
                  <h2>Contáctanos</h2>
                  <p>Estamos listos para ayudarte a encontrar tu próximo automóvil.</p>
                </div>

                <div className="contacto-contenido">

                  <div className="contacto-informacion">

                    <h3>Información de contacto</h3>

                    <div className="contacto-dato">
                      <span>📞</span>
                      <div>
                        <strong>Teléfono</strong>
                        <p>55 1234 5678</p>
                      </div>
                    </div>

                    <div className="contacto-dato">
                      <span>💬</span>
                      <div>
                        <strong>WhatsApp</strong>
                        <p>55 1234 5678</p>
                      </div>
                    </div>

                    <div className="contacto-dato">
                      <span>✉️</span>
                      <div>
                        <strong>Correo electrónico</strong>
                        <p>contacto@automarket.com</p>
                      </div>
                    </div>

                    <div className="contacto-dato">
                      <span>📍</span>
                      <div>
                        <strong>Dirección</strong>
                        <p>Av. Insurgentes Sur 1234, Ciudad de México.</p>
                      </div>
                    </div>

                    <div className="contacto-horarios">
                      <h3>Horarios de atención</h3>
                      <p><strong>Lunes a viernes:</strong> 9:00 a 18:00 h</p>
                      <p><strong>Sábado:</strong> 9:00 a 14:00 h</p>
                      <p><strong>Domingo:</strong> Cerrado</p>
                    </div>

                  </div>

                  <div className="contacto-formulario">

                    <h3>Envíanos un mensaje</h3>

                    <form onSubmit={enviarMensajeContacto}>

                      <div>
                        <label htmlFor="contacto-nombre">Nombre completo *</label>
                        <input
                          type="text"
                          id="contacto-nombre"
                          name="nombre"
                          placeholder="Escribe tu nombre"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="contacto-telefono">Teléfono *</label>
                        <input
                          type="tel"
                          id="contacto-telefono"
                          name="telefono"
                          placeholder="Escribe tu teléfono"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="contacto-correo">Correo electrónico</label>
                        <input
                          type="email"
                          id="contacto-correo"
                          name="correo"
                          placeholder="Escribe tu correo electrónico"
                        />
                      </div>

                      <div>
                        <label htmlFor="contacto-mensaje">Mensaje *</label>
                        <textarea
                          id="contacto-mensaje"
                          name="mensaje"
                          rows="4"
                          placeholder="Escribe tu mensaje"
                          required
                        />
                      </div>

                      <button type="submit" className="btn-primary">
                        ENVIAR MENSAJE
                      </button>

                    </form>

                  </div>

                </div>

                <div className="contacto-mapa">
                  <h3>Encuéntranos</h3>

                  <iframe
                    src="https://www.google.com/maps?q=Av.+Insurgentes+Sur+1234,+Ciudad+de+Mexico&output=embed"
                    title="Ubicación de referencia de AutoMarket en Ciudad de México"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                </div>

              </section>

            </>
          )}

        </main>
        {!mostrarLoginAdmin && (
        <footer className="footer">

          <div className="footer-contenido">

            <div className="footer-identidad">
              <a href="#inicio" className="footer-logo">
                AUTO<span>MARKET</span>
              </a>

              <p>
                Encuentra tu próximo automóvil seminuevo.
                Calidad, confianza y transparencia en cada elección.
              </p>
            </div>

            <div className="footer-contacto">
              <h3>Contacto</h3>
              <p>Teléfono: 55 1234 5678</p>
              <p>Correo: contacto@automarket.com</p>
              <p>Ciudad de México</p>
            </div>

            <div className="footer-enlaces">
              <h3>Enlaces rápidos</h3>
              <a href="#inicio" onClick={volverCatalogo}>Inicio</a>
              <a href="#catalogo" onClick={volverCatalogo}>Catálogo</a>
              <a href="#comparativa" onClick={volverCatalogo}>Comparativa</a>
              <a href="#nosotros" onClick={volverCatalogo}>Nosotros</a>
              <a href="#contacto" onClick={volverCatalogo}>Contacto</a>
            </div>

          </div>

          <div className="footer-inferior">
            <p>© 2026 AutoMarket. Todos los derechos reservados.</p>
          </div>

        </footer>
      )} 
      </div>
    )}
  export default App
