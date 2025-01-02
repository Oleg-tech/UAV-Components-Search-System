import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
