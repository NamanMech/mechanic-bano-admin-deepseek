import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { PageStatusProvider } from './context/PageStatusContext';
import { ApiProvider } from './context/ApiContext';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';

// PWA सेवा वर्कर रजिस्ट्रेशन
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <PageStatusProvider>
        <ApiProvider>
          <App />
        </ApiProvider>
      </PageStatusProvider>
    </AuthProvider>
  </React.StrictMode>
);

// PWA रजिस्ट्रेशन को सक्रिय करें
registerServiceWorker();

// वेब विटल्स रिपोर्टिंग (वैकल्पिक)
reportWebVitals(console.log);
