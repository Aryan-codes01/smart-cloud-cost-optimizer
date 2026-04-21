import { Router } from "express";
import multer from "multer";
import { uploadBillingData } from "../controllers/uploadController.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadRouter = Router();

uploadRouter.post("/", upload.single("billingFile"), uploadBillingData);
