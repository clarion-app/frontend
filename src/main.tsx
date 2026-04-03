import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { store } from './build/store';
import { Provider } from 'react-redux'
import ErrorBoundary from './ErrorBoundary.tsx'
import { ToastContainer } from './notifications/ToastContainer.tsx'
import { backendUrl } from './build/backendUrl'

// Initialize CSRF token on app startup
fetch(backendUrl + '/api/csrf-cookie', { credentials: 'include' }).catch(() => {
  // Non-fatal: CSRF cookie will be fetched on first mutation if needed
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
          <ToastContainer />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
