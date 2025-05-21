import type { Customer } from "@modules/customer/infra/entities/mysql/Customer";

export interface ICreateCustomer extends Omit<Customer, "id"> {}
