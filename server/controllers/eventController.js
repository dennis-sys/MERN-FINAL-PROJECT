import mongoose from "mongoose";
import { Readable } from "stream";
import Event from "../models/Event.js";

function getBucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "documents",
  });
}

async function uploadToGridFS(file) {
  const bucket = getBucket();
  const uploadStream = bucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
  });

  await new Promise((resolve, reject) =>
    Readable.from(file.buffer)
      .pipe(uploadStream)
      .on("finish", resolve)
      .on("error", reject)
  );

  return {
    fileUrl: `/api/files/${uploadStream.id}`,
    filename: file.originalname,
    mimetype: file.mimetype,
  };
}

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ department: req.user.department })
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { name, county, constituency, ward, description, latitude, longitude } =
      req.body;
    const numericLatitude = Number(latitude);
    const numericLongitude = Number(longitude);

    if (
      !name ||
      !county ||
      !constituency ||
      !ward ||
      !Number.isFinite(numericLatitude) ||
      !Number.isFinite(numericLongitude)
    ) {
      return res.status(400).json({
        message: "Event name, county, constituency, ward and valid coordinates are required",
      });
    }

    const photos = req.files?.photos || [];
    const report = req.files?.report?.[0];
    if (photos.length > 3) {
      return res.status(400).json({ message: "You can upload a maximum of 3 photos" });
    }

    const event = new Event({
      name,
      county,
      constituency,
      ward,
      description,
      latitude: numericLatitude,
      longitude: numericLongitude,
      // Never accept department from the browser; use the authenticated account.
      department: req.user.department,
      createdBy: req.user._id,
      photos: await Promise.all(photos.map(uploadToGridFS)),
      report: report ? await uploadToGridFS(report) : null,
    });

    await event.save();
    await event.populate("createdBy", "email");
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};