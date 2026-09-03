import { useEffect, useState } from "react";

function DataPreview() {
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    const savedDataset = sessionStorage.getItem("datalensDataset");

    if (savedDataset) {
      setDataset(JSON.parse(savedDataset));
    }
  }, []);

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

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Data Preview</h2>
          <p>
            Review the structure and sample records of your uploaded dataset.
          </p>
        </div>
      </div>

      {/* Dataset Information */}
      <div className="dataset-stats">

        <div className="stat-card">
          <span>Sheet</span>
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

      {/* Column Names */}
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

      {/* Data Table */}
      <div className="table-card">

        <div className="card-heading">
          <div>
            <h3>Sample Data</h3>
            <p>Showing the first {rows.length} rows of your dataset.</p>
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
                      {row[column] !== undefined && row[column] !== null
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