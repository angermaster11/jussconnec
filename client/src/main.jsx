import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import App from './App';
import './utils/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1F35',
              color: '#F5F5F5',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#00C6C2', secondary: '#0A0F1E' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0A0F1E' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
