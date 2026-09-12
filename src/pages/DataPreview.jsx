import { useEffect, useState } from "react";

function DataPreview() {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const datasetId = params.get("id");

        if (!datasetId) {
          const savedDataset = sessionStorage.getItem("datalensDataset");

          if (savedDataset) {
            setDataset(JSON.parse(savedDataset));
          }

          setLoading(false);
          return;
        }

        const token = sessionStorage.getItem("datalensToken");
        const response = await fetch(
          `http://localhost:5000/api/data/datasets/${datasetId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load dataset.");
        }

        const rawData = result.dataset.raw_data
          ? typeof result.dataset.raw_data === "string"
            ? JSON.parse(result.dataset.raw_data)
            : result.dataset.raw_data
          : [];

        const columnNames =
          rawData.length > 0 ? Object.keys(rawData[0]) : [];

        setDataset({
          sheetName: result.dataset.file_name,
          rows: result.dataset.total_rows,
          columns: result.dataset.total_columns,
          columnNames: columnNames,
          preview: rawData.slice(0, 10),
          data: rawData,
        });

        sessionStorage.setItem(
          "datalensDataset",
          JSON.stringify({
            sheetName: result.dataset.file_name,
            rows: result.dataset.total_rows,
            columns: result.dataset.total_columns,
            columnNames: columnNames,
            preview: rawData.slice(0, 10),
            data: rawData,
          })
        );

        if (result.analysis) {
          sessionStorage.setItem(
            "datalensAnalysis",
            JSON.stringify(result.analysis)
          );
        }
      } catch (error) {
        console.error("Failed to load dataset:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDataset();
  }, []);

  if (loading) {
    return (
      <div className="data-preview-page">
        <div className="preview-empty">
          <h2>Loading dataset...</h2>
          <p>Please wait while DataLens retrieves your dataset.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-preview-page">
        <div className="preview-empty">
          <h2>Unable to load dataset</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="data-preview-page">
        <div className="preview-empty">
          <h2>No dataset loaded</h2>
          <p>
            Upload a CSV, Excel or JSON file from the workspace to preview
            your data.
          </p>
        </div>
      </div>
    );
  }

  const rows = dataset.preview || [];

  return (
    <div className="data-preview-page">
      <div className="page-header">
        <div>
          <h2>Data Preview</h2>
          <p>
            Review the structure and sample records of your dataset.
          </p>
        </div>
      </div>

      <div className="dataset-stats">
        <div className="stat-card">
          <span>Dataset</span>
          <strong>{dataset.sheetName}</strong>
        </div>

        <div className="stat-card">
          <span>Total Rows</span>
          <strong>{dataset.rows}</strong>
        </div>

        <div className="stat-card">
          <span>Total Columns</span>
          <strong>{dataset.columns}</strong>
        </div>
      </div>

      <div className="columns-card">
        <div className="card-heading">
          <h3>Columns</h3>
          <span>{dataset.columns} columns</span>
        </div>

        <div className="column-list">
          {dataset.columnNames.map((column, index) => (
            <span className="column-tag" key={index}>
              {column}
            </span>
          ))}
        </div>
      </div>

      <div className="table-card">
        <div className="card-heading">
          <div>
            <h3>Sample Data</h3>
            <p>
              Showing the first {rows.length} rows of your dataset.
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {dataset.columnNames.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {dataset.columnNames.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      {row[column] !== undefined &&
                      row[column] !== null
                        ? String(row[column])
                        : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataPreview;