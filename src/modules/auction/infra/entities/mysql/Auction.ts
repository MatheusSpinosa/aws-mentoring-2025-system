import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";

import { Customer } from "../../../../customer/infra/entities/mysql/Customer";

@Entity("auction")
@Index("startDate_idx", ["startDate"])
@Index("endDate_idx", ["endDate"])
@Index("status_idx", ["status"])
export class Auction {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  customer: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer" })
  customerData: Customer;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 250 })
  image: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  winner: string | null;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "winner" })
  winnerData: Customer | null;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate: Date | null;

  @Column({ type: "int" })
  counter: number;

  @Column({
    type: "enum",
    enum: ["a", "i", "e"],
    comment: "Status (a)active, (i)inactive, (e)ended",
  })
  status: "a" | "i" | "e";

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
