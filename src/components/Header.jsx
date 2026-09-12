import { Sun, Moon, FileText, Upload, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("datalensToken");
    sessionStorage.removeItem("datalensUser");
    sessionStorage.removeItem("datalensDataset");
    sessionStorage.removeItem("datalensAnalysis");

    navigate("/login");
  };

  return (
    <header className="top-header">

      <div className="header-title">
        <h1>Workspace</h1>
        <p>Analyze and understand your data</p>
      </div>

      <div className="header-actions">

        <button
          className="icon-button"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        <button className="header-button secondary">
          <FileText size={17} />
          <span>Report</span>
        </button>

        <button className="header-button primary">
          <Upload size={17} />
          <span>Upload data</span>
        </button>

        <button
          className="header-button secondary"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>

    </header>
  );
}

export default Header;