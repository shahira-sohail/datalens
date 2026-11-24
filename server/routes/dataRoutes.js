import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import { spawn } from "child_process";
import db from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import fs from "fs";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");
const pythonCommand =
  process.platform === "win32" ? "python" : "python3";

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const deleteUploadedFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to delete uploaded file:", error);
    }
  }
};

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

    const pythonProcess = spawn(pythonCommand, ["python/analyzer.py"], {
      cwd: path.join(__dirname, "../.."),
    });

    let pythonOutput = "";
    let pythonError = "";
    let responseHandled = false;

    pythonProcess.on("error", async (error) => {
      console.error("Failed to start Python process:", error);

      if (responseHandled) return;
      responseHandled = true;

      await deleteUploadedFile(req.file.path);

      res.status(500).json({
        success: false,
        message: "Python analysis could not be started.",
      });
    });

    pythonProcess.stdout.on("data", (chunk) => {
      pythonOutput += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      pythonError += chunk.toString();
    });

    pythonProcess.on("close", async (code) => {
      if(responseHandled) return;
      responseHandled = true;
      if (code !== 0) {
        console.error("Python error:", pythonError);
        await deleteUploadedFile(req.file.path);

        return res.status(500).json({
          success: false,
          message: "Python analysis failed.",
        });
      }

      try {
        const analysis = JSON.parse(pythonOutput);
        if(!analysis.success){
          console.error("Python analysis failed: ", analysis.message);
          await deleteUploadedFile(req.file.path);
          return res.status(500).json({
            success: false,
            message: analysis.message || "Data analysis failed.",
          });
        }
        await db.execute(
          `INSERT INTO analysis_results
          (dataset_id, analysis_data)
          VALUES(?, ?)`,
          [datasetId, JSON.stringify(analysis)]
        );

        await deleteUploadedFile(req.file.path);

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
        await deleteUploadedFile(req.file.path);

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
    await deleteUploadedFile(req.file.path);

    res.status(500).json({
      success: false,
      message: "The file was uploaded but could not be read.",
    });
  }
});

export default router;