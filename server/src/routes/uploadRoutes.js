import { Router } from "express";
import multer from "multer";
import { uploadBillingData } from "../controllers/uploadController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    const isSupportedFile = /\.(csv|json)$/i.test(file.originalname || "");

    if (!isSupportedFile) {
      callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "billingFile"));
      return;
    }

    callback(null, true);
  },
});

export const uploadRouter = Router();

uploadRouter.post("/", upload.single("billingFile"), uploadBillingData);
