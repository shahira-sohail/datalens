import { useEffect, useState } from "react";
import{
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
}from "recharts";

function Analytics() {
  const [analysis, setAnalysis] = useState(null);
  const [categoryColumn, setCategoryColumn] = useState("");
  const [valueColumn, setValueColumn] = useState("");
  const [aggregation, setAggregation] = useState("sum");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const savedAnalysis = sessionStorage.getItem("datalensAnalysis");

    if (savedAnalysis) {
      const parsedAnalysis = JSON.parse(savedAnalysis);
      setAnalysis(parsedAnalysis);
      if(parsedAnalysis.categorical_columns.length > 0){
        setCategoryColumn(parsedAnalysis.categorical_columns[0]);
      }
      if(parsedAnalysis.numeric_columns.length > 0){
        setValueColumn(parsedAnalysis.numeric_columns[0]);
      }
    }
  }, []);

  const PIE_COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#8b5cf6",
  ];

  const savedDataset = sessionStorage.getItem("datalensDataset");
  const dataset = savedDataset ? JSON.parse(savedDataset) : null;
  const chartData = [];

  if(
    dataset && 
    dataset.data &&
    categoryColumn &&
    valueColumn
  ){
    const groupedData = {};
    dataset.data.forEach((row) => {
      const category = row[categoryColumn];
      const value = Number(row[valueColumn]);
      if(category === undefined){
        return;
      }

      if(!groupedData[category]){
        groupedData[category] = {
          total: 0,
          count: 0,
        };
      }

      groupedData[category].count += 1;
      if(!Number.isNaN(value)){
        groupedData[category].total += value;
      }
    });
    Object.entries(groupedData).forEach(([category, data]) => {
      let value = 0;
      if(aggregation === "sum"){
        value = data.total;
      }
      if(aggregation === "average"){
        value = data.count > 0 ? data.total / data.count : 0;
      }
      if(aggregation === "count"){
        value = data.count;
      }
      chartData.push({
        category,
        value: Number(value.toFixed(2)),
      });
    });
  }

  if (!analysis) {
    return (
      <div className="analytics-page">
        <div className="preview-empty">
          <h2>No analysis available</h2>
          <p>
            Upload a dataset from the workspace to generate analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h2>Analytics</h2>
          <p>
            Automatically generated insights from your uploaded dataset.
          </p>
        </div>
      </div>

      <div className="dataset-stats">
        <div className="stat-card">
          <span>Total Rows</span>
          <strong>{analysis.rows}</strong>
        </div>

        <div className="stat-card">
          <span>Total Columns</span>
          <strong>{analysis.columns}</strong>
        </div>

        <div className="stat-card">
          <span>Numeric Columns</span>
          <strong>{analysis.numeric_columns.length}</strong>
        </div>

        <div className="stat-card">
          <span>Categorical Columns</span>
          <strong>{analysis.categorical_columns.length}</strong>
        </div>

        <div className="stat-card">
          <span>Duplicate Rows</span>
          <strong>{analysis.duplicate_rows}</strong>
        </div>
      </div>

      <div className="columns-card">
        <div className="card-heading">
          <div>
            <h3>Numeric Columns</h3>
            <p>
              Columns detected as numerical data by the analysis engine.
            </p>
          </div>
        </div>

        <div className="column-list">
          {analysis.numeric_columns.map((column, index) => (
            <span className="column-tag" key={index}>
              {column}
            </span>
          ))}
        </div>
      </div>

      <div className="quality-section">
        <div className="section-heading">
          <div>
            <h3>Data Quality</h3>
            <p>
              Overview of the quality and completeness of your dataset.
            </p>
          </div>
        </div>

        <div className="quality-grid">
          <div className="quality-card">
            <span>Quality Score</span>
            <strong>{analysis.data_quality.score}%</strong>
            <p>Overall dataset quality</p>
          </div>

          <div className="quality-card">
            <span>Missing Values</span>
            <strong>{analysis.data_quality.total_missing_values}</strong>
            <p>Total missing cells</p>
          </div>

          <div className="quality-card">
            <span>Duplicate Rows</span>
            <strong>{analysis.data_quality.duplicate_rows}</strong>
            <p>Repeated records detected</p>
          </div>
        </div>
      </div>

      <div className="columns-card">
        <div className="card-heading">
          <div>
            <h3>Categorical Columns</h3>
            <p>
              Columns detected as categorical or non-numerical data.
            </p>
          </div>
        </div>

        <div className="column-list">
          {analysis.categorical_columns.map((column, index) => (
            <span className="column-tag" key={index}>
              {column}
            </span>
          ))}
        </div>
      </div>

      <div className="table-card">
        <div className="card-heading">
          <div>
            <h3>Missing Values</h3>
            <p>
              Number of missing values detected in each column.
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Column</th>
                <th>Missing Values</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(analysis.missing_values).map(
                ([column, value]) => (
                  <tr key={column}>
                    <td>{column}</td>
                    <td>{value}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="card-heading">
          <div>
            <h3>Data Quality</h3>
            <p>Quality indicators calculated from your uploaded dataset.</p>
          </div>
        </div>

        <div className="table-card">
          <div className="card-heading">
            <div>
              <h3>Column Statistics</h3>
              <p>Statistical summary of numeric columns in your dataset.</p>
            </div>
          </div>

          {Object.keys(analysis.statistics).length > 0 ? (
            <div className="statistics-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Statistic</th>

                    {Object.keys(analysis.statistics).map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {["count", "mean", "std", "min", "25%", "50%", "75%", "max"].map(
                    (statistic) => (
                      <tr key={statistic}>
                        <td>{statistic}</td>
                        {Object.keys(analysis.statistics).map((column) => (
                          <td key={column}>
                            {analysis.statistics[column][statistic] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-message">No numeric columns available for statistical analysis.</p>
          )}
        </div>

        <div className="table-card">
          <div className="card-heading">
            <div>
              <h3>Missing Values</h3>
              <p>Missing data detected in each column of your dataset.</p>
            </div>
          </div>

          <div className="statistics-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Missing Values</th>
                  <th>Missing %</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(analysis.missing_values).map((column) => (
                  <tr key={column}>
                    <td>{column}</td>
                    <td>{analysis.missing_values[column]}</td>
                    <td>{analysis.missing_percentages[column]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="card-heading">
            <div>
              <h3>Anomaly Detection</h3>
              <p>Potentially usual values detected in numeric columns.</p>
            </div>
          </div>

          <div className="statistics-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Anomalies</th>
                  <th>Percentage</th>
                  <th>Lower Bound</th>
                  <th>Upper Bound</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(analysis.anomalies).map((column) => (
                  <tr key={column}>
                    <td>{column}</td>
                    <td>{analysis.anomalies[column].count}</td>
                    <td>{analysis.anomalies[column].percentage}%</td>
                    <td>{analysis.anomalies[column].lower_bound ?? "-"}</td>
                    <td>{analysis.anomalies[column].upper_bound ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="insights-section">
          <div className="card-heading">
            <div>
              <h3>Data Insights</h3>
              <p>Automaticallly generated observations from your dataset.</p>
            </div>
          </div>

          <div className="insights-list">
            {analysis.insights.map((insight,index) => (
              <div className="insight-item" key={index}>
                <span className="insight-number">
                  {index + 1}
                </span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="quality-grid">
          <div className="quality-card">
            <span>Quality Score</span>
            <strong>
              {analysis.data_quality.score}%
            </strong>
          </div>

          <div className="quality-card">
            <span>Missing Values</span>
            <strong>
              {analysis.data_quality.total_missing_values}
            </strong>
          </div>

          <div className="quality-card">
            <span>Duplicate Rows</span>
            <strong>
              {analysis.data_quality.duplicate_rows}
            </strong>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="card-heading">
          <div>
            <h3>Visual Analysis</h3>
            <p>
              Explore your dataset using dynamically generated charts.
            </p>
          </div>
        </div>

        <div className="chart-controls">
          <div className="chart-control">
            <label>Category</label>
            <select
              value={categoryColumn}
              onChange={(event) => setCategoryColumn(event.target.value)}
            >
              {analysis.categorical_columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div className="chart-control">
            <label>Value</label>
            <select 
              value={valueColumn}
              onChange={(event) => setValueColumn(event.target.value)}
            >
              {analysis.numeric_columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="chart-control">
          <label>Aggregation</label>
          <select 
            value={aggregation}
            onChange={(event) => setAggregation(event.target.value)}
          >
            <option value="sum">Sum</option>
            <option value="average">Average</option>
            <option value="count">Count</option>
          </select>
        </div>

        <div className="chart-control">
          <label>Chart Type</label>
          <select
            value={chartType}
            onChange={(event) => setChartType(event.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div className="chart-container">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              {chartType === "bar" && (
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
                </BarChart>
              )}

              {chartType === "line" && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
              )}

              {chartType === "pie" && (
                <PieChart>
                  <Tooltip />
                  <Pie 
                    data={chartData}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    label
                  >
                    {chartData.map((entry,index) => (
                      <Cell 
                        key={`cell=${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <p className="empty-message">
              No chart data available for the selected columns.
            </p>
          )}
        </div>
      </div>

      <div className="table-card">
        <div className="card-heading">
          <div>
            <h3>Numerical Statistics</h3>
            <p>
              Statistical summary generated using Python and Pandas.
            </p>
          </div>
        </div>

        {Object.keys(analysis.statistics).length === 0 ? (
          <p className="empty-message">
            No numerical columns were available for statistical analysis.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Statistic</th>

                  {Object.keys(analysis.statistics).map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {["count", "mean", "std", "min", "25%", "50%", "75%", "max"].map(
                  (statistic) => (
                    <tr key={statistic}>
                      <td>{statistic}</td>

                      {Object.keys(analysis.statistics).map((column) => (
                        <td key={column}>
                          {analysis.statistics[column][statistic] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;