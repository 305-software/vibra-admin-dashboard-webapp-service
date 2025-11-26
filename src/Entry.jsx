import './components/translator/il8n';

import React, { useEffect } from 'react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

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
        <Provider store={configureStore}>
          <App />
          <ToastContainer
            autoClose={3000}
            position="top-right"
            hideProgressBar
            closeOnClick
            pauseOnHover
            style={{
              top: '90px',
              width: '17%',
              textAlign: 'center',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </Provider>
      </Suspense>
    </React.StrictMode>
  );
};

export default Entry;
