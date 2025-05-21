import type { Repository } from "typeorm";

import { mySQLConnection } from "@shared/infra/typeorm";

import { Auction } from "../entities/mysql/Auction";

export interface ILastAuctionBet
  extends Omit<Auction, "customerData" | "winnerData"> {
  last_bet_id: number | null;
  last_bet_customer: string | null;
  last_bet_customer_name: string | null;
  last_bet_createdAt: Date | null;
  total_bets: number;
}

export class AuctionRepository {
  private repository: Repository<Auction>;

  constructor() {
    this.repository = mySQLConnection.getRepository(Auction);
  }

  async updateAuctionWinner(
    auctionId: number,
    winnerId: string,
  ): Promise<void> {
    await this.repository.update(auctionId, {
      winner: winnerId,
      endDate: new Date(),
      status: "e",
    });
  }

  async getAuctionsAndLastBets(): Promise<ILastAuctionBet[]> {
    const result = await this.repository.query(`
        SELECT 
          a.*,
          ab.id AS last_bet_id,
          ab.customer AS last_bet_customer,
          c.userName AS last_bet_customer_name,
          ab.createdAt AS last_bet_createdAt,
          COALESCE(bet_counts.total_bets, 0) AS total_bets
        FROM auction a
        LEFT JOIN (
          SELECT auction, MAX(id) AS last_bet_id
          FROM auction_bet
          GROUP BY auction
        ) latest_bets ON a.id = latest_bets.auction
        LEFT JOIN auction_bet ab ON ab.id = latest_bets.last_bet_id
        LEFT JOIN customer c ON ab.customer = c.id
        LEFT JOIN (
          SELECT auction, COUNT(*) AS total_bets
          FROM auction_bet
          GROUP BY auction
        ) bet_counts ON a.id = bet_counts.auction;
      `);

    return result || [];
  }

  async updateAuctionsStart(): Promise<void> {
    await this.repository.query(`
      UPDATE 	
        auction a
      LEFT JOIN
        auction_bet abc
      ON abc.auction = a.id
      SET
        a.startDate = date_add(CURRENT_TIMESTAMP,interval 5 minute)
      WHERE 
        a.status = 'a' AND a.winner IS NULL AND abc.id > 0 AND a.startDate <= CURRENT_TIMESTAMP;
    `);
  }

  async findById(id: number): Promise<Auction | null> {
    const auction = await this.repository.findOne({
      where: { id },
      relations: ["customerData", "winnerData"],
    });

    return auction || null;
  }

  async save(data: Auction): Promise<Auction> {
    const result = await this.repository.save(data);

    return result;
  }

  async create(
    data: Omit<Auction, "id" | "customerData" | "winnerData" | "winner">,
  ): Promise<Auction> {
    const newAuction = this.repository.create(data);
    await this.repository.save(newAuction);

    return newAuction;
  }
}
