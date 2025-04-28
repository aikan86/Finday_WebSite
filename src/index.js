import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ottieni l'elemento DOM per il rendering
const rootElement = document.getElementById('root');

// Verifica che l'elemento esista
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemento con ID 'root' non trovato. Controlla il tuo HTML.");
}
