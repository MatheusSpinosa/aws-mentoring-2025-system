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
import { Coupon } from "./Coupon";

@Entity("coupon_use")
@Index("coupom_use_ibfk1_idx", ["customer"])
@Index("coupom_use_ibfk2_idx", ["coupon"])
export class CouponUse {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 50 })
  customer: string;

  @Column({ type: "int", unsigned: true })
  coupon: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer" })
  customerData: Customer;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: "coupon" })
  couponData: Coupon;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}
