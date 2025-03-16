import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/firstLayer/App.jsx";
import "./index.css";
import store from "./app/store.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { Routes, Route } from "react-router-dom";

console.log("main.jsx is executing");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  const root = ReactDOM.createRoot(rootElement);
  console.log("React root created successfully");

  root.render(
    // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
    // </React.StrictMode>
  );
  console.log("React app rendered successfully");
} catch (error) {
  console.error("Failed to mount React app:", error);
}
