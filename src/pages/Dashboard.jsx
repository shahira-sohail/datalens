import { useState } from "react";

import {
  Upload,
  Database,
  Globe,
  ArrowRight,
  FileSpreadsheet,
  FileJson,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if(!file){
      return;
    }
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file",file);
    try{
      const response = await fetch(
        "http://localhost:5000/api/data/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log("Server response:", result);
      if(!response.ok){
        throw new Error(result.message || "Upload failed")
      }
      sessionStorage.setItem(
        "datalensDataset",
        JSON.stringify(result.dataset)
      );

      sessionStorage.setItem(
        "datalensAnalysis",
        JSON.stringify(result.analysis)
      );
    } catch(error){
      console.error("Upload error:", error);
    }
  };
  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="dashboard">

      {/* Welcome */}
      <div className="welcome-section">
        <div>
          <h2>Start your analysis</h2>

          <p>
            Upload a dataset or connect a data source to begin
            exploring your data.
          </p>
        </div>
      </div>


      {/* Upload Area */}
      <div className="upload-card">

        <div className="upload-icon">
          <Upload size={24} />
        </div>

        <h3>Upload your dataset</h3>

        <p>
          Bring your data into DataLens and let the platform
          automatically clean, analyze and visualize it.
        </p>

        {!selectedFile ? (
          <label className="upload-main-button">
            <Upload size={17} />
            Choose a file
            <input 
              type="file"
              accept=".csv, .xlsx, .json"
              hidden
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="selected-file">
            <div className="selected-file-info">
              <CheckCircle2 size={18} />
              <div>
                <strong>{selectedFile.name}</strong>
                <span>
                  {(selectedFile.size / 1024).toFixed(1)}KB
                </span>
              </div>
            </div>
            <button
              className="remove-file"
              onClick={removeFile}
              title="Remove file"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="supported-files">

          <span>
            <FileSpreadsheet size={15} />
            CSV
          </span>

          <span>
            <FileSpreadsheet size={15} />
            Excel
          </span>

          <span>
            <FileJson size={15} />
            JSON
          </span>

        </div>

      </div>


      {/* Other Sources */}
      <div className="sources-section">

        <div className="section-heading">

          <div>
            <h3>Other data sources</h3>

            <p>
              Connect your existing data instead of uploading a file.
            </p>
          </div>

        </div>


        <div className="source-grid">

          {/* SQL */}
          <div className="source-card">

            <div className="source-card-top">
              <div className="source-icon">
                <Database size={20} />
              </div>

              <span className="source-status">
                Available soon
              </span>
            </div>

            <h4>SQL Database</h4>

            <p>
              Connect a SQL database and analyze its tables
              using the DataLens analysis pipeline.
            </p>

            <button className="source-button" disabled>
              Connect database
              <ArrowRight size={16} />
            </button>

          </div>


          {/* API */}
          <div className="source-card">

            <div className="source-card-top">
              <div className="source-icon">
                <Globe size={20} />
              </div>

              <span className="source-status">
                Available soon
              </span>
            </div>

            <h4>API</h4>

            <p>
              Retrieve structured data from an API and send
              it through the same analysis pipeline.
            </p>

            <button className="source-button" disabled>
              Connect API
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </div>


      {/* Empty workspace information */}
      <div className="workspace-note">

        <div className="note-icon">
          <FileText size={18} />
        </div>

        <div>
          <strong>Your workspace is ready</strong>

          <p>
            Once you load a dataset, DataLens will generate
            data quality results, statistics, visualizations,
            anomaly detection and insights automatically.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;