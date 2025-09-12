import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Ensure a root element exists even if the hosting preview does not include public/index.html
function ensureRootContainer() {
  let rootEl = document.getElementById('root');
  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);
  }
  return rootEl;
}

const rootElement = ensureRootContainer();
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
