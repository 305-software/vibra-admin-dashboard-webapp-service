import './components/translator/il8n';

import React, { useEffect } from 'react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import { setHeaderToken } from './interceptors';
import configureStore from './redux/store';

const Entry = () => {
  useEffect(() => {
    setHeaderToken();
  }, []);

  return (
    <React.StrictMode>
      <Suspense fallback="loading...">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Provider store={configureStore}>
            <App />
          </Provider>
        </GoogleOAuthProvider>
      </Suspense>
    </React.StrictMode>
  );
};

export default Entry;
