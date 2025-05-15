import { Request, Response } from "express";

import { AuctionRepository } from "@modules/auction/infra/repositories/AuctionRepository";

import { GetAuctionsUseCase } from "./GetAuctionsUseCase";

class GetAuctionsUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new GetAuctionsUseCase(new AuctionRepository());
    const result = await useCase.execute();

    return response.status(200).json(result);
  }
}

export { GetAuctionsUseController };
