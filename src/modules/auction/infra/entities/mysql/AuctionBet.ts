import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";

import { Customer } from "../../../../customer/infra/entities/mysql/Customer";
import { Auction } from "./Auction";

@Entity("auction_bet")
@Index("auction_bet_ibfk1_idx", ["customer"])
@Index("auction_bet_ibfk2_idx", ["auction"])
export class AuctionBet {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int" })
  auction: number;

  @Column({ type: "varchar" })
  customer: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => Auction)
  @JoinColumn({ name: "auction" })
  auctionData: Auction;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer" })
  customerData: Customer;
}
