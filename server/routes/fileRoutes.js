// routes/fileRoutes.js
// Streams files stored in MongoDB GridFS back to the client.
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/:fileId", async (req, res, next) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    });

    let fileId;
    try {
      fileId = new mongoose.Types.ObjectId(req.params.fileId);
    } catch {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    // Look up metadata so we can set Content-Type and filename
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) return res.status(404).json({ message: "File not found" });

    const file = files[0];
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(file.filename)}"`
    );
    res.set("Cache-Control", "private, max-age=3600");

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
