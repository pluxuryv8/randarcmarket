import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import './index.css';
import App from './App';

// Универсальная поддержка переменных окружения
const manifestUrl =
  // Vite-путь:
  (import.meta as any).env?.VITE_TONCONNECT_MANIFEST_URL
  // CRA-совместимость, если внезапно осталась:
  || (typeof process !== 'undefined' ? (process as any).env?.REACT_APP_TONCONNECT_MANIFEST_URL : undefined)
  // дефолт:
  || '/tonconnect-manifest.json';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
