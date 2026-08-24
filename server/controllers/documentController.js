import mongoose from "mongoose";
import { Readable } from "stream";
import Document from "../models/Document.js";

// ── GridFS helpers ────────────────────────────────────────────────────────────

function getBucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "documents",
  });
}

async function uploadToGridFS(buffer, filename, mimetype) {
  const bucket = getBucket();
  const readable = Readable.from(buffer);
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: mimetype,
  });
  await new Promise((resolve, reject) =>
    readable.pipe(uploadStream).on("finish", resolve).on("error", reject)
  );
  return uploadStream.id; // ObjectId
}

async function deleteFromGridFS(fileId) {
  try {
    const bucket = getBucket();
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch (err) {
    // Non-fatal — log but don't crash the request
    console.warn("GridFS delete warning:", err.message);
  }
}

// ── Controllers ───────────────────────────────────────────────────────────────

export const getDocuments = async (req, res, next) => {
  try {
    const filter = req.user?.department
      ? { department: req.user.department }
      : {};
    const docs = await Document.find(filter)
      .populate("uploadedBy", "email department")
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate(
      "uploadedBy",
      "email department"
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const { title, description, department } = req.body;
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const fileId = await uploadToGridFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const doc = new Document({
      title,
      description,
      department,
      fileUrl: `/api/files/${fileId}`,
      filename: req.file.originalname,
      uploadedBy: req.user ? req.user._id : null,
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Delete the binary from GridFS if it was stored there
    if (doc.fileUrl && doc.fileUrl.startsWith("/api/files/")) {
      const fileId = doc.fileUrl.split("/api/files/")[1];
      await deleteFromGridFS(fileId);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (err) {
    next(err);
  }
};
