import { Router } from "express";

import { UseCouponUseController } from "@modules/auction/useCases/useCoupon/UseCouponUseController";

import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const couponRoutes = Router();

const useCouponUseController = new UseCouponUseController();

couponRoutes.post("/use", ensureAuthenticate, useCouponUseController.handle);

export { couponRoutes };
