import express from "express";
import multer from "multer";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
} from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Store file in memory — controller writes it to MongoDB GridFS
const upload = multer({ storage: multer.memoryStorage() });

// ---------------- ROUTES ----------------
router.get("/", protect, getDocuments);
router.get("/:id", protect, getDocument);
router.post("/", protect, upload.single("file"), createDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

export default router;
