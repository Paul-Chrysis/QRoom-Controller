import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/firstLayer/App.jsx";
import "./index.css";
import store from "./app/store.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
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
