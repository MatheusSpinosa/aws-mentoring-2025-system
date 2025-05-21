import { Repository } from "typeorm";

import { mySQLConnection } from "@shared/infra/typeorm";

import { CouponUse } from "../entities/mysql/CouponUse";

export class CouponUseRepository {
  private repository: Repository<CouponUse>;
  constructor() {
    this.repository = mySQLConnection.getRepository(CouponUse);
  }

  async findCustomer(coupon: number, customer: string): Promise<CouponUse> {
    const result = await this.repository.findOne({
      where: { customer, coupon },
    });

    return result || null;
  }

  async create(
    data: Omit<CouponUse, "id" | "customerData" | "couponData">,
  ): Promise<CouponUse> {
    const newCoupon = this.repository.create(data);
    const coupon = await this.repository.save(newCoupon);

    return coupon;
  }
}
