import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as authApi from '../../api/auth.api';
import './CambiarPassword.css';

export function CambiarPassword() {
  const { usuario, marcarPasswordCambiada } = useAuth();
  const navigate = useNavigate();

  const [claveActual, setClaveActual] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (nuevaClave !== confirmacion) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }
    if (nuevaClave.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setCargando(true);
    try {
      await authApi.cambiarPassword(claveActual, nuevaClave, confirmacion);
      setExito(true);
      marcarPasswordCambiada();
      setTimeout(() => navigate('/modulos'), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo actualizar la contraseña.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="cp-screen">
      <form className="cp-card" onSubmit={handleSubmit}>
        <div className="cp-icon"><KeyIcon /></div>
        <h1>Actualiza tu contraseña</h1>
        <div className="sub">
          Hola {usuario?.nombre_usuario?.split(' ')[0]}, por seguridad debes cambiar tu
          contraseña antes de continuar. Esta es la primera vez que ingresas al sistema.
        </div>

        {error && (
          <div className="cp-error"><AlertIcon /> {error}</div>
        )}
        {exito && (
          <div className="cp-success"><CheckIcon /> Contraseña actualizada. Redirigiendo...</div>
        )}

        <div className={`cp-field ${error ? 'cp-field-error' : ''}`}>
          <label>Contraseña actual</label>
          <input
            type="password"
            value={claveActual}
            onChange={(e) => setClaveActual(e.target.value)}
            placeholder="Tu DNI, si es tu primer ingreso"
            required
          />
        </div>

        <div className="cp-field">
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={nuevaClave}
            onChange={(e) => setNuevaClave(e.target.value)}
            required
          />
        </div>
        <div className="cp-hint">Mínimo 8 caracteres.</div>

        <div className="cp-field">
          <label>Confirmar nueva contraseña</label>
          <input
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
          />
        </div>

        <button className="cp-btn" type="submit" disabled={cargando || exito}>
          {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
}

function KeyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5L19 11l3-3" />
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
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}