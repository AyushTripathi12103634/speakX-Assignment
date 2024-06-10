import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from "axios";

axios.defaults.baseURL = process.env.server || "http://localhost:5000/server/api";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);