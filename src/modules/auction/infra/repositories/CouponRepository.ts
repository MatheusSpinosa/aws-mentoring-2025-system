import { Repository } from "typeorm";

import { mySQLConnection } from "@shared/infra/typeorm";

import { Coupon } from "../entities/mysql/Coupon";

export class CouponRepository {
  private repository: Repository<Coupon>;
  constructor() {
    this.repository = mySQLConnection.getRepository(Coupon);
  }

  async save(data: Coupon): Promise<Coupon> {
    const coupon = await this.repository.save(data);

    return coupon;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const coupon = await this.repository.findOne({
      where: { code },
    });

    return coupon || null;
  }
}
