import { AppError } from "@errors/AppError";
import type { BetCashRepository } from "@modules/auction/infra/repositories/BetCashRepository";
import type { CouponRepository } from "@modules/auction/infra/repositories/CouponRepository";
import type { CouponUseRepository } from "@modules/auction/infra/repositories/CouponUseRepository";

interface IRequest {
  customer: string;
  code: string;
}

class UseCouponUseCase {
  constructor(
    private couponRepository: CouponRepository,
    private couponUseRepository: CouponUseRepository,
    private betCashRepository: BetCashRepository,
  ) {}

  async execute({ code, customer }: IRequest): Promise<void> {
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    if (!customer || !code) {
      throw new AppError("Customer not found", 404);
    }

    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon || coupon.status != "a") {
      throw new AppError("Coupon not found");
    }

    const checkPreviousRescues = await this.couponUseRepository.findCustomer(
      coupon.id,
      customer,
    );

    if (checkPreviousRescues) {
      throw new AppError("You already use this coupon");
    }

    await this.couponUseRepository.create({
      coupon: coupon.id,
      customer,
      createdAt: new Date(),
    });

    await this.betCashRepository.create({
      customer,
      amount: coupon.bets,
      type: "c",
      createdAt: new Date(),
    });
  }
}

export { UseCouponUseCase };
