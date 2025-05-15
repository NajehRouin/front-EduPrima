import { Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/auth";

function PrivateRoute({ children, roleRequired }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && !hasRole(roleRequired)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
