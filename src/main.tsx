import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { FirebaseProvider } from "./contexts/firebase";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>
);
