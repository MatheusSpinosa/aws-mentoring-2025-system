/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repository } from "typeorm";

import { mySQLConnection } from "@shared/infra/typeorm";

import { BetCash } from "../entities/mysql/BetCash";

export class BetCashRepository {
  private repository: Repository<BetCash>;
  constructor() {
    this.repository = mySQLConnection.getRepository(BetCash);
  }

  async balance(customer: string): Promise<{
    credit: number;
    debit: number;
    balance: number;
  }> {
    const balance = await this.repository.query(`
      SELECT 
        SUM(bc.amount) AS amount, bc.type 
      FROM 
        bet_cash bc
      WHERE
        bc.customer = "${customer.replace(/[^A-Za-z0-9-]/g, "")}"
      GROUP BY bc.type;
      `);

    const c = balance.filter((i: any) => i?.type === "c");
    const d = balance.filter((i: any) => i?.type === "d");

    const credit = c[0]?.amount || 0;
    const debit = d[0]?.amount || 0;

    const data = {
      credit: Number(credit) || 0,
      debit: Number(debit) || 0,
      balance: Number(credit || 0) - Number(debit || 0),
    };

    return data;
  }

  async create(data: Omit<BetCash, "id" | "customerData">): Promise<BetCash> {
    const newCoupon = this.repository.create(data);
    const coupon = await this.repository.save(newCoupon);

    return coupon;
  }
}
