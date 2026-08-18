import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../pages/Login/Login';
import { SeleccionModulos } from '../pages/SeleccionModulos/SeleccionModulos';
import { CambiarPassword } from '../pages/CambiarPassword/CambiarPassword';

// Placeholders temporales — se reemplazan por las páginas reales
// (client/src/pages/...) a medida que las vayamos armando.
const AlmacenHome = () => <div>Módulo Almacén (pendiente)</div>;
const Forbidden = () => <div>403 — No tienes permiso para ver esto</div>;

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<Forbidden />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cambiar-password" element={<CambiarPassword />} />
            <Route path="/modulos" element={<SeleccionModulos />} />
          </Route>

          <Route
            element={<ProtectedRoute requiereOpcion="ALM-KDX-CON" tipoRolMinimo="CONS" />}
          >
            <Route path="/almacen" element={<AlmacenHome />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}