import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Table2,
  BarChart3,
  Database,
  Upload,
  Globe,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">DL</div>

        <div>
          <div className="brand-name">DataLens</div>
          <div className="brand-subtitle">
            Analytics workspace
          </div>
        </div>
      </div>


      {/* Workspace */}
      <div className="sidebar-section">

        <div className="sidebar-heading">
          Workspace
        </div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/data-preview"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Table2 size={18} />
          <span>Data Preview</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </NavLink>

      </div>


      {/* Data Sources */}
      <div className="sidebar-section">

        <div className="sidebar-heading">
          Data Sources
        </div>

        <NavLink
          to="/data-sources"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Upload size={18} />
          <span>File Upload</span>
        </NavLink>

        <button className="sidebar-link sidebar-button">
          <Database size={18} />
          <span>SQL Database</span>
          <span className="coming-soon">Soon</span>
        </button>

        <button className="sidebar-link sidebar-button">
          <Globe size={18} />
          <span>API</span>
          <span className="coming-soon">Soon</span>
        </button>

      </div>


      {/* Bottom */}
      <div className="sidebar-bottom">

        <div className="sidebar-footer-title">
          DataLens
        </div>

        <div className="sidebar-footer-text">
          Automated data analysis
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;