import { Request, Response } from "express";

import { BetCashRepository } from "@modules/auction/infra/repositories/BetCashRepository";
import { CouponRepository } from "@modules/auction/infra/repositories/CouponRepository";
import { CouponUseRepository } from "@modules/auction/infra/repositories/CouponUseRepository";

import { UseCouponUseCase } from "./UseCouponUseCase";

class UseCouponUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { code } = request.body;

    const { id } = request.customer;
    const useCase = new UseCouponUseCase(
      new CouponRepository(),
      new CouponUseRepository(),
      new BetCashRepository(),
    );
    const result = await useCase.execute({
      customer: id,
      code,
    });

    return response.status(200).json(result);
  }
}

export { UseCouponUseController };
