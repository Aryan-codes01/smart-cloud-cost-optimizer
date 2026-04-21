import { Router } from "express";
import {
  getActionLogsController,
  runAction,
} from "../controllers/actionController.js";

export const actionRouter = Router();

actionRouter.get("/", getActionLogsController);
actionRouter.post("/:actionId/execute", runAction);
