import { Navigate } from 'react-router-dom';
import { getToken } from '../network/http/tokenHelper';

export default function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}
