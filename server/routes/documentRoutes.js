// routes/documentRoutes.js
import express from "express";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
} from "../controllers/documentController.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Accept any file type — resource_type "auto" handles images, video, raw (docs, pdf, etc.)
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "cdms-documents",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    type: "upload",
  }),
});

const upload = multer({ storage });

// ---------------- ROUTES ----------------

// GET all documents
router.get("/", getDocuments);

// GET one document
router.get("/:id", getDocument);

// CREATE document with file upload
router.post("/", upload.single("file"), createDocument);

// UPDATE (no file update)
router.put("/:id", updateDocument);

// DELETE
router.delete("/:id", deleteDocument);

export default router;


