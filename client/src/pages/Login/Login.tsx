import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [codigoUsuario, setCodigoUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await login(codigoUsuario.trim().toUpperCase(), clave);
      navigate('/modulos');
    } catch (err: any) {
      // El backend devuelve el mensaje del SP (SQLSTATE 45000) limpio en err.response.data.message
      const mensaje = err?.response?.data?.message || 'Usuario o contraseña incorrectos';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-full">
      <div className="brand-panel">
        <div className="deco"></div>

        <div className="brand-mid">
          <div className="eyebrow">Sistema Integrado de Gestión Administrativa</div>
          <h1>Control de <b>almacén e inventario</b> para tu hospital</h1>
          <p>
            Recepción, PECOSA, transferencias y Kardex valorizado en un mismo sistema,
            con seguridad granular por usuario y almacén.
          </p>

          <div className="brand-stats">
            <div><p>2</p><p>Almacenes activos</p></div>
            <div><p>36</p><p>Procesos disponibles</p></div>
            <div><p>3</p><p>Alertas pendientes</p></div>
          </div>
        </div>

        <div className="brand-bottom">
          <span>© 2026 Hospital de Barranca</span>
          <span>v1.0</span>
        </div>
      </div>

      <div className="form-panel">
        <form className="form-col" onSubmit={handleSubmit}>
          <div className="hi">Bienvenido de nuevo</div>
          <div className="sub">Ingresa tus credenciales para continuar</div>

          <div className="field">
            <label>Usuario</label>
            <div className="input-wrap">
              <UserIcon />
              <input
                type="text"
                placeholder="Ej. jperez"
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className={`field ${error ? 'field-error' : ''}`}>
            <label>Contraseña</label>
            <div className="input-wrap">
              <LockIcon />
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div className="error-msg">
                <AlertIcon /> {error}
              </div>
            )}
          </div>

          <div className="row-between">
            <label className="chk">
              <input type="checkbox" style={{ width: 'auto', padding: 0 }} /> Recordarme
            </label>
            <a href="#">¿Olvidaste tu clave?</a>
          </div>

          <button className="login-btn" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>

          <div className="form-foot">Acceso restringido — Personal autorizado del hospital</div>
        </form>
      </div>
    </div>
  );
}

// Iconos inline en SVG (sin depender de una libreria/CDN externa)
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}