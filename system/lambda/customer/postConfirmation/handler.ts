import { CognitoUserPoolEvent } from "aws-lambda";
import dotenv from "dotenv";
import mysql from "mysql2";
import { DataSource } from "typeorm";

import { Customer } from "../../../src/modules/customer/infra/entities/mysql/Customer";

dotenv.config();
// Typeorm configuration
const mySQLConnection = new DataSource({
  type: "mysql",
  driver: mysql,
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PSWD,
  database: process.env.MYSQL_DATABASE,
  entities: [Customer],
  synchronize: false,
});

const ensureDatabaseConnection = async () => {
  if (!mySQLConnection.isInitialized) {
    await mySQLConnection.initialize();
  }
};

export const handler = async (event: CognitoUserPoolEvent) => {
  try {
    // Validate environment variables
    if (
      !process.env.MYSQL_HOST ||
      !process.env.MYSQL_USER ||
      !process.env.MYSQL_PSWD
    ) {
      throw new Error(
        "Variáveis de ambiente do banco de dados não configuradas.",
      );
    }

    // Connect with MySQL
    await ensureDatabaseConnection();

    // Get user data from Cognito
    const { request } = event;
    const { email, sub, preferred_username } = request.userAttributes;

    // Create customer repository
    const customerRepository = mySQLConnection.getRepository(Customer);

    // Save user in MySQL
    const newCustomer = customerRepository.create({
      id: sub, // Cognito user ID
      userName: preferred_username || email.split("@")[0],
      email,
    });

    await customerRepository.save(newCustomer);

    console.log("Usuário salvo com sucesso no MySQL:", newCustomer);

    return event; // The Cognito event must be returned
  } catch (error) {
    console.error("Erro ao salvar usuário no MySQL:", error);
    throw error;
  }
};
