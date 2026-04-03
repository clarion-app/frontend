import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { selectLoggedInUser } from '../user/loggedInUserSlice';

/**
 * Guards authenticated routes. Unauthenticated users are redirected to /login
 * with the original URL saved in location state for post-login redirect.
 */
export const ProtectedRoute = () => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const location = useLocation();

  if (!loggedInUser.id) {
    // Save the attempted URL so login can redirect back after auth
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
