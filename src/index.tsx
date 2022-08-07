import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { UserProvider } from "./provider/UserProvider";
import { CompleteProvider } from "./provider/CompleteProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <CompleteProvider>
        <App />
      </CompleteProvider>
    </UserProvider>
  </React.StrictMode>
);
