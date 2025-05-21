import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";

@Entity("customer")
@Unique(["userName"])
@Unique(["email"])
export class Customer {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id: string;

  @Column({ type: "varchar", length: 100 })
  userName: string;

  @Column({ type: "varchar", length: 100 })
  email: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}
