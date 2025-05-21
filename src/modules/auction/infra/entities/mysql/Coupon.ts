import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from "typeorm";

@Entity("coupon")
@Unique("code_UNIQUE", ["code"])
@Index("status_idx", ["status"])
export class Coupon {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 45 })
  code: string;

  @Column({ type: "int", unsigned: true })
  bets: number;

  @Column({ type: "int" })
  maxUse: number;

  @Column({
    type: "enum",
    enum: ["a", "i"],
    comment: "Status (a)active, (i)inactive",
  })
  status: "a" | "i";

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
