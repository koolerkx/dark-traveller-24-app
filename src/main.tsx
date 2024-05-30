import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { FirebaseProvider } from "./contexts/firebase";
import { AuthProvider } from "./contexts/auth";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FirebaseProvider>
  </React.StrictMode>
);
