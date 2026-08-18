import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './SeleccionModulos.css';

interface ModuloDef {
  codigo: string; // coincide con codigo_modulo en la tabla modulos_sistema
  ruta: string;
  nombre: string;
  descripcion: string;
  icon: JSX.Element;
  disponible: boolean; // si ya existe la pantalla en el frontend
}

const MODULOS: ModuloDef[] = [
  {
    codigo: 'ALMACEN',
    ruta: '/almacen',
    nombre: 'Almacén',
    descripcion: 'Recepción, PECOSA, Kardex',
    icon: <WarehouseIcon />,
    disponible: true,
  },
  {
    codigo: 'CONFIGURACION',
    ruta: '/configuracion',
    nombre: 'Configuración',
    descripcion: 'Catálogos y maestros',
    icon: <AdjustIcon />,
    disponible: false,
  },
  {
    codigo: 'UTILITARIOS',
    ruta: '/utilitarios',
    nombre: 'Utilitarios',
    descripcion: 'Alertas y transmisiones',
    icon: <ToolsIcon />,
    disponible: false,
  },
  {
    codigo: 'ADMINISTRADOR',
    ruta: '/administrador',
    nombre: 'Administrador',
    descripcion: 'Usuarios y permisos',
    icon: <ShieldIcon />,
    disponible: false,
  },
];

export function SeleccionModulos() {
  const { usuario, perfil, logout } = useAuth();
  const navigate = useNavigate();

  const iniciales = usuario?.nombre_usuario
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Solo se muestran los módulos donde el usuario tiene al menos una opción
  // asignada (o si es ADMIN, que ve todo). Igual que la seguridad real: la
  // BD decide, aquí solo se refleja lo que el backend ya filtró en el JWT.
  function tieneModulo(codigoModulo: string) {
    if (usuario?.es_admin_sistema) return true;
    return perfil.some((p) => p.codigo_modulo === codigoModulo);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-brand">
          <div className="mark">S</div>
          <div className="name">
            SIGA Hospital
            <small>Barranca · Cajatambo</small>
          </div>
        </div>
        <div className="topbar-user">
          <div className="who">
            <p>{usuario?.nombre_usuario}</p>
            <p>{usuario?.codigo_usuario}</p>
          </div>
          <div className="avatar-sm">{iniciales}</div>
          <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <LogoutIcon />
          </button>
        </div>
      </div>

      <div className="wrap">
        <div className="eyebrow">Sistema Integrado de Gestión Administrativa</div>
        <h1>Selecciona un módulo</h1>
        <div className="sub">Solo se muestran los módulos habilitados para tu perfil</div>

        <div className="module-grid">
          {MODULOS.map((m) => {
            const habilitado = tieneModulo(m.codigo) && m.disponible;

            const contenido = (
              <>
                <div className="ic">{m.icon}</div>
                <div className="txt">
                  <h3>{m.nombre}</h3>
                  <p>{m.descripcion}</p>
                </div>
                {habilitado ? (
                  <ChevronIcon />
                ) : (
                  <span className="soon">
                    {!tieneModulo(m.codigo) ? 'Sin acceso' : 'En construcción'}
                  </span>
                )}
              </>
            );

            return habilitado ? (
              <Link key={m.codigo} to={m.ruta} className="module-card">
                {contenido}
              </Link>
            ) : (
              <div key={m.codigo} className="module-card disabled">
                {contenido}
              </div>
            );
          })}

          <div className="module-card disabled">
            <div className="ic"><BankIcon /></div>
            <div className="txt">
              <h3>Patrimonio</h3>
              <p>Activos fijos</p>
            </div>
            <span className="soon">Próximamente</span>
          </div>
        </div>

        <div className="foot">Hospital de Barranca — Cajatambo · v1.0</div>
      </div>
    </>
  );
}

function WarehouseIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21V10l9-6 9 6v11" />
      <path d="M3 21h18" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}
function AdjustIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="10" r="2" /><line x1="6" y1="4" x2="6" y2="8" /><line x1="6" y1="12" x2="6" y2="20" />
      <circle cx="12" cy="16" r="2" /><line x1="12" y1="4" x2="12" y2="14" /><line x1="12" y1="18" x2="12" y2="20" />
      <circle cx="18" cy="7" r="2" /><line x1="18" y1="4" x2="18" y2="5" /><line x1="18" y1="9" x2="18" y2="20" />
    </svg>
  );
}
function ToolsIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}
function BankIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18" /><path d="M3 10h18" /><path d="M12 3l9 7H3l9-7z" />
      <path d="M6 10v11" /><path d="M12 10v11" /><path d="M18 10v11" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}