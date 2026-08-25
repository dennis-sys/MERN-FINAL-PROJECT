import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { getEvents, createEvent } from "../controllers/eventController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 4,
    fileSize: 20 * 1024 * 1024,
  },
});

router.get("/", protect, getEvents);
router.post(
  "/",
  protect,
  upload.fields([
    { name: "photos", maxCount: 3 },
    { name: "report", maxCount: 1 },
  ]),
  createEvent
);

export default router;