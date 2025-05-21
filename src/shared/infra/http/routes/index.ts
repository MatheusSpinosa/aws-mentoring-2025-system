import { Router } from "express";

import { auctionRoutes } from "./auction";
import { couponRoutes } from "./coupon";
import { customerRoutes } from "./customer";

const router = Router();

router.use("/auction", auctionRoutes);
router.use("/coupon", couponRoutes);
router.use("/customer", customerRoutes);

export { router };
