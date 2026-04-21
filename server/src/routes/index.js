import { Router } from "express";
import { dashboardRouter } from "./dashboardRoutes.js";
import { uploadRouter } from "./uploadRoutes.js";
import { providerRouter } from "./providerRoutes.js";
import { actionRouter } from "./actionRoutes.js";

export const apiRouter = Router();

apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/providers", providerRouter);
apiRouter.use("/actions", actionRouter);
