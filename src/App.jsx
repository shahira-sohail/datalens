import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import DataPreview from "./pages/DataPreview";
import Analytics from "./pages/Analytics";
import DataSources from "./pages/DataSources";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";


function AppLayout({ darkMode, setDarkMode }) {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  /* Authentication pages */
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  /* Main DataLens application */
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="page-content">

          <Routes>

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/data-preview"
              element={
                <ProtectedRoute>
                  <DataPreview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/data-sources"
              element={
                <ProtectedRoute>
                  <DataSources />
                </ProtectedRoute>
              }
            />

          </Routes>

        </div>

      </main>

    </div>
  );
}


function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return sessionStorage.getItem("datalensTheme") === "dark";
  });

  useEffect(() => {
    sessionStorage.setItem(
      "datalensTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <BrowserRouter>

      <div className={darkMode ? "app dark" : "app"}>

        <AppLayout
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

      </div>

    </BrowserRouter>
  );
}


export default App;