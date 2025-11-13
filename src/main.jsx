import { StrictMode } from 'react'
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from './routes';

import './styles/main.css'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
