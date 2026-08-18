import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  requiereOpcion?: string;
  tipoRolMinimo?: string;
}

// Uso:
//   <Route element={<ProtectedRoute />}>            -> solo exige estar logueado
//   <Route element={<ProtectedRoute requiereOpcion="ALM-ENT-ANU" tipoRolMinimo="APRB" />} />
export function ProtectedRoute({ requiereOpcion, tipoRolMinimo }: Props) {
  const { isAuthenticated, tieneAcceso, usuario } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Evita el bucle: si ya estamos parados en /cambiar-password, no volver a
  // redirigir hacia la misma ruta (Navigate a la ubicación actual no renderiza nada).
  if (usuario?.debe_cambiar_pass && location.pathname !== '/cambiar-password') {
    return <Navigate to="/cambiar-password" replace />;
  }

  if (requiereOpcion && tipoRolMinimo && !tieneAcceso(requiereOpcion, tipoRolMinimo)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}