import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { createDocument } from "../controllers/documentController.js";

const router = express.Router();

// Cloudinary storage for PDFs
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cdms-documents",
    resource_type: "raw", // IMPORTANT for PDFs
    allowed_formats: ["pdf"],
  },
});

const upload = multer({ storage });

// Upload document
router.post("/", upload.single("file"), createDocument);

export default router;

