import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import DataPreview from "./pages/DataPreview";
import Analytics from "./pages/Analytics";
import DataSources from "./pages/DataSources";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>

      <div className={darkMode ? "app dark" : "app"}>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="main-content">

          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <div className="page-content">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/data-preview"
                element={<DataPreview />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/data-sources"
                element={<DataSources />}
              />

            </Routes>

          </div>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;