import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole, dbRole }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Cargando...</div>;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  if (requiredRole) {
    // "admin" y "superAdmin" pueden acceder a rutas de admin
    const allowed =
      requiredRole === "admin"
        ? dbRole === "admin" || dbRole === "superAdmin"
        : dbRole === requiredRole;

    if (!allowed) return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
