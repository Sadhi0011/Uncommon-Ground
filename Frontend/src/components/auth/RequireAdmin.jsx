import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container-luxe py-32 text-center">
        <p className="text-lg text-haze">Checking access…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl uppercase text-sand">Admins only</h1>
        <p className="mt-4 text-haze">You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
