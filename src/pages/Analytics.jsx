import { useEffect, useState } from "react";
import "./Analytics.css";

import {
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
} from "recharts";

function Analytics() {
  const [analysis, setAnalysis] = useState(null);
  const [dataset, setDataset] = useState(null);

  const [categoryColumn, setCategoryColumn] = useState("");
  const [valueColumn, setValueColumn] = useState("");
  const [aggregation, setAggregation] = useState("sum");
  const [chartType, setChartType] = useState("bar");

  const PIE_COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#8b5cf6",
  ];

  useEffect(() => {
    try {
      const savedAnalysis =
        sessionStorage.getItem("datalensAnalysis");

      const savedDataset =
        sessionStorage.getItem("datalensDataset");

      if (savedAnalysis) {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        setAnalysis(parsedAnalysis);

        const categoricalColumns =
          parsedAnalysis.categorical_columns || [];

        const numericColumns =
          parsedAnalysis.numeric_columns || [];

        if (categoricalColumns.length > 0) {
          setCategoryColumn(categoricalColumns[0]);
        }

        if (numericColumns.length > 0) {
          setValueColumn(numericColumns[0]);
        }
      }

      if (savedDataset) {
        setDataset(JSON.parse(savedDataset));
      }
    } catch (error) {
      console.error(
        "Error loading analytics data:",
        error
      );
    }
  }, []);

  if (!analysis) {
    return (
      <div className="analytics-page">
        <div className="preview-empty">
          <h2>No analysis available</h2>

          <p>
            Upload a dataset from the workspace to generate
            analytics.
          </p>
        </div>
      </div>
    );
  }

  const numericColumns =
    analysis.numeric_columns || [];

  const categoricalColumns =
    analysis.categorical_columns || [];

  const missingValues =
    analysis.missing_values || {};

  const missingPercentages =
    analysis.missing_percentages || {};

  const statistics =
    analysis.statistics || {};

  const anomalies =
    analysis.anomalies || {};

  const insights =
    analysis.insights || [];

  const dataQuality =
    analysis.data_quality || {};

  /*
    Build chart data
  */

  const chartData = [];

  if (
    dataset &&
    Array.isArray(dataset.data) &&
    categoryColumn &&
    valueColumn
  ) {
    const groupedData = {};

    dataset.data.forEach((row) => {
      const category = row[categoryColumn];

      if (
        category === undefined ||
        category === null ||
        category === ""
      ) {
        return;
      }

      const value = Number(row[valueColumn]);

      if (!groupedData[category]) {
        groupedData[category] = {
          total: 0,
          count: 0,
          numericCount: 0,
        };
      }

      groupedData[category].count += 1;

      if (!Number.isNaN(value)) {
        groupedData[category].total += value;
        groupedData[category].numericCount += 1;
      }
    });

    Object.entries(groupedData).forEach(
      ([category, data]) => {
        let value = 0;

        if (aggregation === "sum") {
          value = data.total;
        }

        if (aggregation === "average") {
          value =
            data.numericCount > 0
              ? data.total / data.numericCount
              : 0;
        }

        if (aggregation === "count") {
          value = data.count;
        }

        chartData.push({
          category,
          value: Number(value.toFixed(2)),
        });
      }
    );
  }

  return (
    <div className="analytics-page">

      {/* =========================
          Page Header
      ========================= */}

      <div className="page-header">
        <div>
          <h2>Analytics</h2>

          <p>
            Automatically generated insights from your
            uploaded dataset.
          </p>
        </div>
      </div>


      {/* =========================
          Dataset Summary
      ========================= */}

      <div className="dataset-stats">

        <div className="stat-card">
          <span>Total Rows</span>
          <strong>{analysis.rows ?? 0}</strong>
        </div>

        <div className="stat-card">
          <span>Total Columns</span>
          <strong>{analysis.columns ?? 0}</strong>
        </div>

        <div className="stat-card">
          <span>Numeric Columns</span>
          <strong>{numericColumns.length}</strong>
        </div>

        <div className="stat-card">
          <span>Categorical Columns</span>
          <strong>{categoricalColumns.length}</strong>
        </div>

        <div className="stat-card">
          <span>Duplicate Rows</span>
          <strong>{analysis.duplicate_rows ?? 0}</strong>
        </div>

      </div>


      {/* =========================
          Numeric Columns
      ========================= */}

      <div className="columns-card">

        <div className="card-heading">
          <div>
            <h3>Numeric Columns</h3>

            <p>
              Columns detected as numerical data by the
              analysis engine.
            </p>
          </div>
        </div>

        {numericColumns.length > 0 ? (
          <div className="column-list">

            {numericColumns.map((column) => (
              <span
                className="column-tag"
                key={column}
              >
                {column}
              </span>
            ))}

          </div>
        ) : (
          <p className="empty-message">
            No numeric columns detected.
          </p>
        )}

      </div>


      {/* =========================
          Categorical Columns
      ========================= */}

      <div className="columns-card">

        <div className="card-heading">
          <div>
            <h3>Categorical Columns</h3>

            <p>
              Columns detected as categorical or
              non-numerical data.
            </p>
          </div>
        </div>

        {categoricalColumns.length > 0 ? (
          <div className="column-list">

            {categoricalColumns.map((column) => (
              <span
                className="column-tag"
                key={column}
              >
                {column}
              </span>
            ))}

          </div>
        ) : (
          <p className="empty-message">
            No categorical columns detected.
          </p>
        )}

      </div>


      {/* =========================
          Data Quality
      ========================= */}

      <div className="quality-section">

        <div className="section-heading">
          <div>
            <h3>Data Quality</h3>

            <p>
              Overview of the quality and completeness of
              your dataset.
            </p>
          </div>
        </div>

        <div className="quality-grid">

          <div className="quality-card">
            <span>Quality Score</span>

            <strong>
              {dataQuality.score ?? 0}%
            </strong>

            <p>
              Overall dataset quality
            </p>
          </div>

          <div className="quality-card">
            <span>Missing Values</span>

            <strong>
              {dataQuality.total_missing_values ?? 0}
            </strong>

            <p>
              Total missing cells
            </p>
          </div>

          <div className="quality-card">
            <span>Duplicate Rows</span>

            <strong>
              {dataQuality.duplicate_rows ??
                analysis.duplicate_rows ??
                0}
            </strong>

            <p>
              Repeated records detected
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          Missing Values
      ========================= */}

      <div className="table-card">

        <div className="card-heading">
          <div>
            <h3>Missing Values</h3>

            <p>
              Missing data detected in each column of your
              dataset.
            </p>
          </div>
        </div>

        {Object.keys(missingValues).length > 0 ? (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Column</th>
                  <th>Missing Values</th>
                  <th>Missing %</th>
                </tr>
              </thead>

              <tbody>

                {Object.entries(missingValues).map(
                  ([column, value]) => (

                    <tr key={column}>

                      <td>{column}</td>

                      <td>{value}</td>

                      <td>
                        {missingPercentages[column] ??
                          0}
                        %
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (
          <p className="empty-message">
            No missing-value information available.
          </p>
        )}

      </div>


      {/* =========================
          Column Statistics
      ========================= */}

      <div className="table-card">

        <div className="card-heading">
          <div>
            <h3>Column Statistics</h3>

            <p>
              Statistical summary of numeric columns in
              your dataset.
            </p>
          </div>
        </div>

        {Object.keys(statistics).length > 0 ? (

          <div className="statistics-table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Statistic</th>

                  {Object.keys(statistics).map(
                    (column) => (
                      <th key={column}>
                        {column}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {[
                  "count",
                  "mean",
                  "std",
                  "min",
                  "25%",
                  "50%",
                  "75%",
                  "max",
                ].map((statistic) => (

                  <tr key={statistic}>

                    <td>{statistic}</td>

                    {Object.keys(statistics).map(
                      (column) => (

                        <td key={column}>

                          {statistics[column][
                            statistic
                          ] ?? "—"}

                        </td>

                      )
                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <p className="empty-message">
            No numeric columns available for
            statistical analysis.
          </p>

        )}

      </div>


      {/* =========================
          Anomaly Detection
      ========================= */}

      <div className="table-card">

        <div className="card-heading">
          <div>
            <h3>Anomaly Detection</h3>

            <p>
              Potentially unusual values detected in
              numeric columns.
            </p>
          </div>
        </div>

        {Object.keys(anomalies).length > 0 ? (

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

                {Object.entries(anomalies).map(
                  ([column, data]) => (

                    <tr key={column}>

                      <td>{column}</td>

                      <td>
                        {data.count ?? 0}
                      </td>

                      <td>
                        {data.percentage ?? 0}%
                      </td>

                      <td>
                        {data.lower_bound ?? "—"}
                      </td>

                      <td>
                        {data.upper_bound ?? "—"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <p className="empty-message">
            No anomaly information available.
          </p>

        )}

      </div>


      {/* =========================
          Data Insights
      ========================= */}

      <div className="table-card">

        <div className="card-heading">
          <div>
            <h3>Data Insights</h3>

            <p>
              Automatically generated observations from
              your dataset.
            </p>
          </div>
        </div>

        {insights.length > 0 ? (

          <div className="insights-list">

            {insights.map((insight, index) => (

              <div
                className="insight-item"
                key={index}
              >

                <span className="insight-number">
                  {index + 1}
                </span>

                <p>{insight}</p>

              </div>

            ))}

          </div>

        ) : (

          <p className="empty-message">
            No automatic insights were generated.
          </p>

        )}

      </div>


      {/* =========================
          Visual Analysis
      ========================= */}

      <div className="table-card">

        <div className="card-heading">
          <div>
            <h3>Visual Analysis</h3>

            <p>
              Explore your dataset using dynamically
              generated charts.
            </p>
          </div>
        </div>


        <div className="chart-controls">

          <div className="chart-control">

            <label>Category</label>

            <select
              value={categoryColumn}
              onChange={(event) =>
                setCategoryColumn(event.target.value)
              }
              disabled={categoricalColumns.length === 0}
            >

              {categoricalColumns.length === 0 ? (
                <option value="">
                  No categorical columns
                </option>
              ) : (
                categoricalColumns.map((column) => (
                  <option
                    key={column}
                    value={column}
                  >
                    {column}
                  </option>
                ))
              )}

            </select>

          </div>


          <div className="chart-control">

            <label>Value</label>

            <select
              value={valueColumn}
              onChange={(event) =>
                setValueColumn(event.target.value)
              }
              disabled={numericColumns.length === 0}
            >

              {numericColumns.length === 0 ? (
                <option value="">
                  No numeric columns
                </option>
              ) : (
                numericColumns.map((column) => (
                  <option
                    key={column}
                    value={column}
                  >
                    {column}
                  </option>
                ))
              )}

            </select>

          </div>


          <div className="chart-control">

            <label>Aggregation</label>

            <select
              value={aggregation}
              onChange={(event) =>
                setAggregation(event.target.value)
              }
            >

              <option value="sum">
                Sum
              </option>

              <option value="average">
                Average
              </option>

              <option value="count">
                Count
              </option>

            </select>

          </div>


          <div className="chart-control">

            <label>Chart Type</label>

            <select
              value={chartType}
              onChange={(event) =>
                setChartType(event.target.value)
              }
            >

              <option value="bar">
                Bar Chart
              </option>

              <option value="line">
                Line Chart
              </option>

              <option value="pie">
                Pie Chart
              </option>

            </select>

          </div>

        </div>


        <div className="chart-container">

          {chartData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={400}
            >

              {chartType === "bar" && (

                <BarChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="category" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                  />

                </BarChart>

              )}


              {chartType === "line" && (

                <LineChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="category" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />

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

                    {chartData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                </PieChart>

              )}

            </ResponsiveContainer>

          ) : (

            <p className="empty-message">
              No chart data available for the selected
              columns.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Analytics;