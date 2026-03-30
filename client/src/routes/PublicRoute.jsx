import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/common/Spinner';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/feed" replace /> : <Outlet />;
};

export default PublicRoute;
