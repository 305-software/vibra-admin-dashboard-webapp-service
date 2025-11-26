import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import * as constant from "../../utlis/constant";
import Spinner from "../../utlis/spinner";
import { AuthContext } from './authProvider';

/**
 * ProtectedRoute Component
 * 
 * This component acts as a guard for protected routes. It checks if the user is authenticated 
 * and either renders the child components or redirects to the login page. It also shows a 
 * loading spinner while the authentication status is being checked.
 * 
 * @component
 * @example
 * return (
 *   <ProtectedRoute>
 *     <YourProtectedComponent />
 *   </ProtectedRoute>
 * )
 */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  
  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Only redirect after we're sure about authentication status
  if (!isAuthenticated) {
    localStorage.setItem(constant.LASTPATH, location.pathname);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;