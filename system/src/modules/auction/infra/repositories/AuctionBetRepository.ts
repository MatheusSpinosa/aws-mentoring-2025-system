/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repository } from "typeorm";

import { mySQLConnection } from "@shared/infra/typeorm";

import { AuctionBet } from "../entities/mysql/AuctionBet";

export class AuctionBetRepository {
  private repository: Repository<AuctionBet>;
  constructor() {
    this.repository = mySQLConnection.getRepository(AuctionBet);
  }

  async listByAuctionId(auction: number): Promise<AuctionBet[]> {
    const auctionBets = await this.repository.find({
      where: { auction },
      relations: ["customerData"],
    });
    return auctionBets || [];
  }

  async create(
    data: Omit<AuctionBet, "id" | "customerData" | "auctionData" | "createdAt">,
  ): Promise<AuctionBet> {
    const newCoupon = this.repository.create(data);
    const coupon = await this.repository.save(newCoupon);

    return coupon;
  }
}
