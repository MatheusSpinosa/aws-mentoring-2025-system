import { Router } from "express";

import { CreateAuctionUseController } from "@modules/auction/useCases/createAuction/CreateAuctionUseController";
import { GetAuctionsUseController } from "@modules/auction/useCases/getAuctions/GetAuctionsUseController";

import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const auctionRoutes = Router();

const getAuctionsUseController = new GetAuctionsUseController();
const createAuctionUseController = new CreateAuctionUseController();

auctionRoutes.get("/", getAuctionsUseController.handle);

auctionRoutes.post(
  "/create",
  ensureAuthenticate,
  createAuctionUseController.handle,
);

export { auctionRoutes };
