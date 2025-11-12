import React from "react";
import { registerSW } from "./sw-register.js";
import { registerSW();
createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./state/AppContext.jsx";
import App from "./App.jsx";
import "./index.css";

registerSW();
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
