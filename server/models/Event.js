import mongoose from "mongoose";

const eventMediaSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  county: { type: String, required: true, trim: true },
  constituency: { type: String, required: true, trim: true },
  ward: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  department: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photos: { type: [eventMediaSchema], default: [] },
  report: { type: eventMediaSchema, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Event", eventSchema);