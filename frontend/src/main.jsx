/**
 * ============================================
 * UNIT I - React Basics: Entry Point
 * ============================================
 * 
 * Main Entry Point:
 * - React application entry point
 * - Sets up Redux store and Router
 * - Demonstrates: ReactDOM.render, Provider, BrowserRouter
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store  from './store/store.js';
import App from './App.jsx';
import './index.css';

// React 18 uses createRoot instead of ReactDOM.render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux Provider - makes store available to all components (UNIT VI) */}
    <Provider store={store}>
      {/* React Router - enables client-side routing (UNIT V) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);


