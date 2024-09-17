// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import config from './config'; // Import the config file

const ProtectedRoute = ({ element: Component, roleRequired, ...rest }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (token && email) {
        try {
          const response = await axios.post(`${config.baseURL}/handleSession`, { token, email });

          console.log('Response from server:', response);

          if (response.data.isAuthenticated) {
            setAuth({
              isAuthenticated: true,
              role: response.data.role.toLowerCase(), // Normalize role to lowercase
              loading: false,
            });
          } else {
            setAuth({ isAuthenticated: false, role: null, loading: false });
            console.warn('User is not authenticated:', response.data);
          }
        } catch (error) {
          console.error('Error during authentication request:', error);
          setAuth({ isAuthenticated: false, role: null, loading: false });
        }
      } else {
        setAuth({ isAuthenticated: false, role: null, loading: false });
        console.warn('Token or email is missing from localStorage');
      }
    };

    checkAuth();
  }, []);

  if (auth.loading) return <div>Loading...</div>;

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (roleRequired && auth.role !== roleRequired.toLowerCase()) {
    // Normalize roleRequired to lowercase for comparison
    return <Navigate to="/not-authorized" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
