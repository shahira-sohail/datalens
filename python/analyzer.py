import sys
import json
import pandas as pd

def detect_anomalies(df, numeric_columns):
    anomalies = {}

    for column in numeric_columns:
        series = df[column].dropna()

        if len(series) < 4:
            anomalies[column] = {
                "count": 0,
                "percentage": 0,
                "lower_bound": None,
                "upper_bound": None
            }
            continue

        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)

        iqr = q3 - q1

        lower_bound = q1 - (1.5 * iqr)
        upper_bound = q3 + (1.5 * iqr)

        anomaly_count = int(
            ((series < lower_bound) | (series > upper_bound)).sum()
        )

        percentage = round(
            (anomaly_count / len(series)) * 100,
            2
        )

        anomalies[column] = {
            "count": anomaly_count,
            "percentage": percentage,
            "lower_bound": round(float(lower_bound), 2),
            "upper_bound": round(float(upper_bound), 2)
        }

    return anomalies

def generate_insights(
    df,
    numeric_columns,
    categorical_columns,
    missing_values,
    duplicate_rows,
    anomalies
):
    insights = []

    total_rows = len(df)
    total_columns = len(df.columns)

    # Dataset size
    insights.append(
        f"The dataset contains {total_rows} records across {total_columns} columns."
    )

    # Numeric columns
    if numeric_columns:
        insights.append(
            f"{len(numeric_columns)} numeric columns were identified for statistical analysis."
        )

    # Categorical columns
    if categorical_columns:
        insights.append(
            f"{len(categorical_columns)} categorical columns were identified for categorical analysis."
        )

    # Missing values
    columns_with_missing = [
        column
        for column, count in missing_values.items()
        if count > 0
    ]

    if columns_with_missing:
        insights.append(
            f"{len(columns_with_missing)} columns contain missing values."
        )
    else:
        insights.append(
            "No missing values were detected in the dataset."
        )

    # Duplicate rows
    if duplicate_rows > 0:
        insights.append(
            f"{duplicate_rows} duplicate records were detected."
        )
    else:
        insights.append(
            "No duplicate records were detected."
        )

    # Anomalies
    total_anomalies = sum(
        item["count"]
        for item in anomalies.values()
    )

    if total_anomalies > 0:
        insights.append(
            f"{total_anomalies} potential anomalies were detected across numeric columns."
        )
    else:
        insights.append(
            "No potential anomalies were detected in numeric columns."
        )

    return insights

def analyze_data(data):
    df = pd.DataFrame(data)

    total_rows = len(df)
    total_columns = len(df.columns)

    numeric_columns = df.select_dtypes(include="number").columns.tolist()

    categorical_columns = df.select_dtypes(
        exclude="number"
    ).columns.tolist()

    # Missing values
    missing_values = df.isnull().sum().to_dict()

    missing_percentages = {}

    for column in df.columns:
        missing_count = int(df[column].isnull().sum())

        if total_rows > 0:
            percentage = round((missing_count / total_rows) * 100, 2)
        else:
            percentage = 0

        missing_percentages[column] = percentage

    # Duplicate rows
    duplicate_rows = int(df.duplicated().sum())

    # Numerical statistics
    statistics = {}

    if numeric_columns:
        statistics = (
            df[numeric_columns]
            .describe()
            .round(2)
            .to_dict()
        )

    # Overall data quality
    total_missing_values = int(df.isnull().sum().sum())

    total_cells = total_rows * total_columns

    if total_cells > 0:
        missing_ratio = total_missing_values / total_cells
    else:
        missing_ratio = 0

    if total_rows > 0:
        duplicate_ratio = duplicate_rows / total_rows
    else:
        duplicate_ratio = 0

    quality_score = round(
        100 - (
            (missing_ratio * 70 * 100)
            + 
            (duplicate_ratio * 30 * 100)
        ),
        2
    )

    quality_score = max(0, min(100, quality_score))
    anomalies = detect_anomalies(df, numeric_columns)
    insights = generate_insights(
        df,
        numeric_columns,
        categorical_columns,
        missing_values,
        duplicate_rows,
        anomalies
    )

    return {
        "success": True,

        "rows": total_rows,
        "columns": total_columns,

        "column_names": df.columns.tolist(),

        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,

        "missing_values": missing_values,
        "missing_percentages": missing_percentages,

        "duplicate_rows": duplicate_rows,

        "statistics": statistics,

        "anomalies": anomalies,

        "insights": insights,

        "data_quality": {
            "score": quality_score,
            "total_missing_values": total_missing_values,
            "duplicate_rows": duplicate_rows
        }
    }


if __name__ == "__main__":
    input_data = sys.stdin.read()

    if not input_data:
        print(json.dumps({
            "success": False,
            "message": "No data received."
        }))
        sys.exit()

    try:
        data = json.loads(input_data)

        result = analyze_data(data)

        print(json.dumps(result))

    except Exception as error:
        print(json.dumps({
            "success": False,
            "message": str(error)
        }))