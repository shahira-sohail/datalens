import {
  Upload,
  Database,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import "./DataSources.css";

function DataSources() {
  return (
    <div className="data-sources-page">

      {/* Page Header */}
      <div className="data-sources-header">
        <h1>Data Sources</h1>
        <p>
          Connect different data sources and bring your data into DataLens.
        </p>
      </div>

      {/* Source Cards */}
      <div className="data-source-grid">

        {/* File Upload */}
        <div className="data-source-card">
          <div className="data-source-icon">
            <Upload size={21} />
          </div>

          <div className="data-source-status available">
            <CheckCircle2 size={12} />
            Available
          </div>

          <h3>File Upload</h3>

          <p>
            Upload CSV, Excel or JSON files and automatically
            analyze their data.
          </p>

          <button className="data-source-button">
            Upload file
            <ArrowRight size={16} />
          </button>
        </div>

        {/* SQL Database */}
        <div className="data-source-card">
          <div className="data-source-icon">
            <Database size={21} />
          </div>

          <div className="data-source-status">
            Available soon
          </div>

          <h3>SQL Database</h3>

          <p>
            Connect a SQL database and analyze tables directly
            through the DataLens analysis pipeline.
          </p>

          <button className="data-source-button" disabled>
            Connect database
            <ArrowRight size={16} />
          </button>
        </div>

        {/* API */}
        <div className="data-source-card">
          <div className="data-source-icon">
            <Globe size={21} />
          </div>

          <div className="data-source-status">
            Available soon
          </div>

          <h3>API</h3>

          <p>
            Retrieve structured data from an external API and
            analyze it using the same pipeline.
          </p>

          <button className="data-source-button" disabled>
            Connect API
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}

export default DataSources;