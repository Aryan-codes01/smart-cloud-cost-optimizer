import { Router } from "express";
import {
  getProviders,
  syncProviderController,
} from "../controllers/cloudController.js";

export const providerRouter = Router();

providerRouter.get("/", getProviders);
providerRouter.post("/sync", syncProviderController);
