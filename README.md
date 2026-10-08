# DataLens – Automated Multi-Source Data Analysis & Visualization Platform

DataLens is a full-stack data analysis and visualization platform that allows users to upload datasets, analyze their structure and quality, detect anomalies, explore statistics, and visualize data through an interactive web interface.

The project combines a React frontend, Node.js/Express REST APIs, Python-based data analysis, and SQL database storage.

> **Current status:** Core full-stack data analysis platform implemented.  
> **Next phase:** Integrating Generative AI, LLM APIs, tool calling, and agentic workflows.

---

## Features

### 📂 Multi-Format Data Upload

DataLens supports:

- CSV
- Excel (`.xlsx`)
- JSON

Uploaded datasets are processed through the backend and stored for further analysis.

### 📊 Automated Data Analysis

The Python analysis layer performs:

- Dataset structure analysis
- Row and column statistics
- Missing-value detection
- Missing-value percentages
- Duplicate detection
- Numerical statistics
- Data-quality scoring
- Outlier detection
- Anomaly analysis
- Rule-based insights

### 📈 Data Visualization

The frontend provides interactive visualizations for exploring uploaded datasets and their analysis results.

### 🔍 Data Quality & Anomaly Detection

DataLens automatically evaluates dataset quality and identifies potential anomalies using statistical analysis.

The Python analysis layer uses Pandas for dataset processing and statistical calculations.

### 🔐 Authentication

The application includes user authentication with:

- User registration
- Login
- Password hashing
- JWT-based authentication
- Protected backend routes

### 🗄️ SQL Database

DataLens uses MySQL to store application data including:

- Users
- Datasets
- Analysis results

Dataset metadata and analysis results are associated with database records for persistent storage.

### 🔌 REST API

The Node.js/Express backend exposes REST endpoints for:

- Authentication
- Dataset management
- Dataset upload and analysis
- SQL data-source testing
- Analysis result retrieval

---

## Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│          Vite + JS           │
│                              │
│ Dashboard / Upload / Charts  │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│      Node.js + Express       │
│                              │
│ Authentication              │
│ Dataset APIs                │
│ Analysis APIs               │
│ Database Integration        │
└──────────────┬───────────────┘
               │
        ┌──────┴────────┐
        │               │
        ▼               ▼
┌──────────────┐  ┌──────────────┐
│    MySQL     │  │ Python       │
│   Database   │  │ Analyzer     │
│              │  │              │
│ Users        │  │ Pandas       │
│ Datasets     │  │ Statistics   │
│ Analyses     │  │ Anomalies    │
└──────────────┘  └──────────────┘
```

---

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- React Router
- Recharts
- Axios
- Lucide React
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST APIs
- Multer
- JWT
- bcryptjs

### Data Analysis

- Python
- Pandas

### Database

- MySQL
- mysql2

### Development & Tools

- Git
- GitHub
- VS Code
- Postman / API testing tools

---

## Project Structure

```text
datalens/
│
├── public/
│
├── python/
│   └── analyzer.py
│
├── server/
│   ├── routes/
│   ├── uploads/
│   ├── db.js
│   └── server.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── config.js
│   └── ...
│
├── requirements.txt
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Data Analysis Workflow

```text
User uploads dataset
        ↓
React Frontend
        ↓
Node.js / Express API
        ↓
File Processing
        ↓
Python Analyzer
        ↓
Pandas Analysis
        ↓
Statistics + Quality + Anomalies + Insights
        ↓
MySQL Storage
        ↓
Results returned to React
        ↓
Interactive Dashboard
```

---

# 🚀 Planned AI Roadmap

The next development phase of DataLens will extend the existing analytics engine with Generative AI capabilities.

These features are planned and are **not part of the current implementation yet**.

### Phase 1 – LLM API Integration

Integrate an LLM API with the existing backend to transform structured analysis results into natural-language explanations.

Example:

```text
Dataset statistics
        ↓
LLM API
        ↓
Natural-language insights
```

The goal is to allow users to ask questions such as:

> "What are the most important problems in this dataset?"

and receive explanations based on the actual computed analysis.

---

### Phase 2 – AI-Generated Data Insights

The AI layer will consume structured results produced by the existing Python analyzer.

Potential capabilities:

- Explain dataset quality
- Summarize important patterns
- Explain detected anomalies
- Highlight unusual values
- Generate business-oriented observations
- Answer questions about analysis results

The AI will operate on computed application data rather than inventing dataset statistics.

---

### Phase 3 – Tool Calling

The backend analysis functions will be exposed as tools that an LLM can request when necessary.

Potential tools:

```text
get_dataset_summary()
get_column_statistics()
find_missing_values()
find_outliers()
get_anomaly_details()
get_data_quality_score()
```

A user could ask:

> "Which columns have the most missing values?"

The model could determine that it needs the missing-value analysis tool and use the returned result to formulate an answer.

---

### Phase 4 – Agentic Data Analyst

The next stage will introduce an agentic workflow.

Instead of responding only to a single prompt, the AI system will be able to:

```text
User Question
      ↓
AI determines required information
      ↓
Selects appropriate analysis tools
      ↓
Calls tools
      ↓
Evaluates returned results
      ↓
Performs additional tool calls if required
      ↓
Generates final response
```

The goal is to build a DataLens AI Analyst capable of reasoning over the application's analysis capabilities.

---

### Phase 5 – LangChain Orchestration

After understanding direct LLM APIs and tool calling, LangChain will be explored for orchestrating the AI workflow.

Planned concepts include:

- LLM integration
- Tool definitions
- Tool execution
- Prompt management
- Agent workflows
- Structured outputs
- Multi-step AI workflows

---

## Future Architecture

```text
                 ┌──────────────────────┐
                 │     React Frontend   │
                 │                      │
                 │ Dashboard + AI Chat  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Node.js / Express    │
                 │                      │
                 │ REST APIs            │
                 │ AI APIs              │
                 │ Tool Layer           │
                 └───────┬───────┬──────┘
                         │       │
                ┌────────┘       └─────────┐
                ▼                          ▼
       ┌─────────────────┐        ┌─────────────────┐
       │ Python Analyzer │        │   LLM / AI API  │
       │                 │        │                 │
       │ Pandas          │        │ AI Insights     │
       │ Statistics      │        │ Tool Calling    │
       │ Anomalies       │        │ Agent Workflow  │
       └────────┬────────┘        └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │      MySQL      │
       │                 │
       │ Users           │
       │ Datasets        │
       │ Analysis Data   │
       └─────────────────┘
```

---

## Learning Roadmap

The AI development of DataLens will be built incrementally:

1. LLM and Generative AI fundamentals
2. Direct LLM API integration
3. AI-generated insights
4. Connecting AI with DataLens analysis results
5. Tool calling
6. Agentic workflows
7. LangChain
8. Advanced AI + full-stack integration
9. AI Full-Stack project refinement

---

## Current Status

### Implemented

- [x] React frontend
- [x] Node.js / Express backend
- [x] REST APIs
- [x] User authentication
- [x] JWT authentication
- [x] MySQL database
- [x] CSV upload
- [x] Excel upload
- [x] JSON upload
- [x] Python/Pandas analysis
- [x] Data-quality analysis
- [x] Statistical analysis
- [x] Duplicate detection
- [x] Outlier/anomaly detection
- [x] Interactive data visualization
- [x] Environment-based frontend API configuration

### Planned

- [ ] LLM API integration
- [ ] AI-generated insights
- [ ] AI analysis assistant
- [ ] Backend analysis tools
- [ ] LLM tool calling
- [ ] Agentic DataLens Analyst
- [ ] LangChain orchestration
- [ ] Additional AI-powered analytics workflows

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shahira-sohail/datalens.git
cd datalens
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file and configure the required application secrets and database settings.

Do not commit `.env` to GitHub.

### 5. Start the frontend

```bash
npm run dev
```

### 6. Start the backend

```bash
npm start
```

The frontend and backend can then communicate through the configured API base URL.

---

## Project Goals

DataLens is being developed as a practical full-stack engineering project with a gradual transition toward AI-assisted data analysis.

The long-term goal is to combine:

**Full-Stack Development + Data Analysis + LLMs + Tool Calling + Agentic Workflows**

into a single application.

---

## Author

**Shahira Sohail**

BCA Student | Full-Stack Development | Data & AI Engineering

GitHub:  
https://github.com/shahira-sohail

LinkedIn:  
https://linkedin.com/in/shahira-sohail-a106b0310