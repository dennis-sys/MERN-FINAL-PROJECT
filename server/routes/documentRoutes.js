import express from "express";
import multer from "multer";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
} from "../controllers/documentController.js";

const router = express.Router();

// Store file in memory — controller writes it to MongoDB GridFS
const upload = multer({ storage: multer.memoryStorage() });

// ---------------- ROUTES ----------------
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.post("/", upload.single("file"), createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
