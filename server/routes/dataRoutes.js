import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import { spawn } from "child_process";

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

router.post("/upload", upload.single("file"), (req, res) => {
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

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python error:", pythonError);

        return res.status(500).json({
          success: false,
          message: "Python analysis failed.",
        });
      }

      try {
        const analysis = JSON.parse(pythonOutput);

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

export default router;