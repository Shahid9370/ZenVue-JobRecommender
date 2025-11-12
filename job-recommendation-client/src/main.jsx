import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthProvider"; // updated import path
import "./index.css";

export default function Main() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);