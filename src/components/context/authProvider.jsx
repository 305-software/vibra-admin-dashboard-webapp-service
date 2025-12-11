import axios from "axios";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import config from "../../config";
import * as constant from "../../utlis/constant";
import Spinner from "../../utlis/spinner";


/**
 * AuthProvider Component
 * 
 * This component provides authentication context to its children components. It handles user authentication, 
 * token refresh, and session validation using Axios. It also manages the user's authentication state and 
 * redirects the user to the last visited path upon successful authentication.
 * 
 * @component
 * @example
 * return (
 *   <AuthProvider>
 *     <YourComponent />
 *   </AuthProvider>
 * )
 */

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  // ✅ Refresh token function
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return null;

    try {
      setIsRefreshing(true);
      const response = await axios.post(config.refreshTokenUrl,
         {
           "refreshToken": localStorage.getItem("refreshToken") || ""
         },
          { withCredentials: true });

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
        return response.data.accessToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
    return null;
  }, [isRefreshing]);

  // ✅ Validate token and restore session
  const validateToken = useCallback(async (retry = false) => {
    try {
      const response = await axios.get(config.validateToken, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      if (response?.data?.valid) {
        setAuth({
          isAuthenticated: true,
          user: response.data.user,
          loading: false,
        });

        if (!initialAuthCheckDone) {
          setInitialAuthCheckDone(true);
          // ✅ Restore last visited path
          const lastPath = localStorage.getItem(constant.LASTPATH) || "/";
          navigate(lastPath, { replace: true });
        }

        return true;
      }
    } catch (error) {
      if (error.response?.status === 401 && retry) {
        const newToken = await refreshToken();
        if (newToken) {
          return validateToken(false);
        }
      }

      setAuth({ isAuthenticated: false, user: null, loading: false });
    }

    return false;
  }, [refreshToken, initialAuthCheckDone, navigate]);

  // ✅ Effect to check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      await validateToken();
    };
    checkAuth();
  }, [validateToken]);

  // ✅ Store last visited path when authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem(constant.LASTPATH, location.pathname);
    }
  }, [location.pathname, auth.isAuthenticated]);

  // ✅ Logout function
  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem(constant.LASTPATH); // Clear last path on logout
    delete axios.defaults.headers.common["Authorization"];
    setAuth({ isAuthenticated: false, user: null, loading: false });
    navigate("/", { replace: true });
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      ...auth,
      setAuth,
      refreshToken,
      logout: handleLogout,
      initialAuthCheckDone,
    }),
    [auth, refreshToken, handleLogout, initialAuthCheckDone]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {auth.loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;