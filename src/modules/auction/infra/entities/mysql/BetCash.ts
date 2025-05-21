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

@Entity("bet_cash")
@Index("bet_cash_ibfk1_idx", ["customer"])
@Index("type_idx", ["type"])
export class BetCash {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar" })
  customer: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer" })
  customerData: Customer;

  @Column({ type: "int", unsigned: true })
  amount: number;

  @Column({
    type: "enum",
    enum: ["c", "d"],
    comment: "Type (c)credit, (d)debit",
  })
  type: "c" | "d";

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}
