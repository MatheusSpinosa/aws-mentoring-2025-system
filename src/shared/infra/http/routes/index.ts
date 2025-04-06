import { Router } from "express";

import { customerRoutes } from "./customer";

const router = Router();

router.use("/customer", customerRoutes);

export { router };
