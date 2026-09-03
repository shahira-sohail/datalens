import { Sun, Moon, FileText, Upload } from "lucide-react";

function Header({ darkMode, setDarkMode }) {
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

      </div>

    </header>
  );
}

export default Header;