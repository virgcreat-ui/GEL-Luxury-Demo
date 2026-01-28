
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { printConciergeAudit } from './services/conciergeAudit';

// DEV-only voice audit (checks all concierge voice keys for all 6 languages)
const DEV_MODE = import.meta.env.DEV;
if (DEV_MODE) {
  // Run audit after a short delay to avoid blocking initial render
  setTimeout(() => printConciergeAudit(), 1000);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
