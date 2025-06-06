import { Request, Response } from "express";

import { AuctionRepository } from "@modules/auction/infra/repositories/AuctionRepository";

import { CreateAuctionUseCase } from "./CreateAuctionUseCase";

class CreateAuctionUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { startDate, name, image } = request.body;

    const { id } = request.customer;
    const useCase = new CreateAuctionUseCase(new AuctionRepository());
    const result = await useCase.execute({
      customer: id,
      counter: 15,
      startDate,
      name,
      image,
    });

    return response.status(200).json(result);
  }
}

export { CreateAuctionUseController };
