import type { Repository } from "typeorm";

import { Customer } from "@modules/customer/infra/entities/mysql/Customer";
import { mySQLConnection } from "@shared/infra/typeorm";

export class CustomerRepository {
  private repository: Repository<Customer>;

  constructor() {
    this.repository = mySQLConnection.getRepository(Customer);
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.repository.findOne({
      where: { id },
    });

    return customer || null;
  }

  async create(customer: Customer): Promise<Customer> {
    const newCustomer = this.repository.create(customer);
    await this.repository.save(newCustomer);

    return newCustomer;
  }
}
