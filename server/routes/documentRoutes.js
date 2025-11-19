import express from "express";
import multer from "multer";
import path from "path";
import { createDocument, getDocuments, getDocument, updateDocument, deleteDocument } from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // unique filename: timestamp-originalname
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get("/", getDocuments);
router.get("/:id", getDocument);

// protect creation / delete / update
router.post("/", protect, upload.single("file"), createDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

export default router;
