import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import { spawn } from "child_process";
import db from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".csv", ".xlsx", ".json"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, Excel and JSON files are allowed."));
    }
  },
});

router.get("/datasets", authMiddleware, async (req, res) => {
  try {
    const [datasets] = await db.execute(
      `SELECT id, file_name, file_type, total_rows, total_columns, created_at
       FROM datasets
       WHERE user_id = ?
       ORDER BY id DESC`,
       [req.user.id]
    );

    res.json({
      success: true,
      datasets: datasets,
    });
  } catch (error) {
    console.error("Failed to fetch datasets:", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch datasets.",
    });
  }
});

router.get("/datasets/:id", authMiddleware, async (req, res) => {
  try {
    const datasetId = req.params.id;

    const [datasets] = await db.execute(
      `SELECT *
       FROM datasets
       WHERE id = ? AND user_id = ?`,
      [datasetId, req.user.id]
    );

    if (datasets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found.",
      });
    }

    const [analysisResults] = await db.execute(
      `SELECT analysis_data, created_at
       FROM analysis_results
       WHERE dataset_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [datasetId]
    );

    res.json({
      success: true,
      dataset: datasets[0],
      analysis: analysisResults.length > 0
        ? analysisResults[0].analysis_data
        : null,
    });
  } catch (error) {
    console.error("Failed to fetch dataset:", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch dataset.",
    });
  }
});

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file was uploaded.",
    });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const extension = path.extname(req.file.originalname).toLowerCase();
    let fileType = extension.replace(".","").toUpperCase();
    const [insertResult] = await db.execute(
      `INSERT INTO datasets
      (file_name, file_type, total_rows, total_columns, raw_data, user_id)
      VALUES(?, ?, ?, ?, ?, ?)`,
      [
        req.file.originalname,
        fileType,
        data.length,
        data.length > 0 ? Object.keys(data[0]).length : 0,
        JSON.stringify(data),
        req.user.id,
      ]
    );
    const datasetId = insertResult.insertId;

    const pythonProcess = spawn("python", ["python/analyzer.py"], {
      cwd: path.join(__dirname, "../.."),
    });

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (chunk) => {
      pythonOutput += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      pythonError += chunk.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python error:", pythonError);

        return res.status(500).json({
          success: false,
          message: "Python analysis failed.",
        });
      }

      try {
        const analysis = JSON.parse(pythonOutput);
        await db.execute(
          `INSERT INTO analysis_results
          (dataset_id, analysis_data)
          VALUES(?, ?)`,
          [datasetId, JSON.stringify(analysis)]
        );

        res.json({
          success: true,
          message: "File uploaded and analyzed successfully.",

          file: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
          },

          dataset: {
            sheetName: sheetName,
            rows: data.length,
            columns: data.length > 0 ? Object.keys(data[0]).length : 0,
            columnNames: data.length > 0 ? Object.keys(data[0]) : [],
            preview: data.slice(0, 10),
            data: data,
          },

          analysis: analysis,
        });
      } catch (error) {
        console.error("Invalid Python response:", error);

        res.status(500).json({
          success: false,
          message: "Python returned an invalid analysis result.",
        });
      }
    });

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

  } catch (error) {
    console.error("File reading error:", error);

    res.status(500).json({
      success: false,
      message: "The file was uploaded but could not be read.",
    });
  }
});

router.post("/sql/test", async (req, res) => {
  try {
    const { host, user, password, database } = req.body;

    if (!host || !user || !database) {
      return res.status(400).json({
        success: false,
        message: "Host, user and database are required.",
      });
    }

    const mysql = await import("mysql2/promise");

    const connection = await mysql.default.createConnection({
      host,
      user,
      password,
      database,
    });

    await connection.query("SELECT 1");

    await connection.end();

    res.json({
      success: true,
      message: "SQL database connected successfully.",
    });
  } catch (error) {
    console.error("SQL connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not connect to SQL database.",
    });
  }
});

export default router;