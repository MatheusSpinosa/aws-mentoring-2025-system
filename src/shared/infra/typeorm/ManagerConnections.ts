/* eslint-disable no-use-before-define */
import { DataSource, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

import { mySQLConnection } from ".";

export class ManagerConnection {
  private static instance: ManagerConnection | null = null;

  private mySqlManager: DataSource;
  private queryRunners: { [x: string]: QueryRunner };

  private constructor() {
    this.mySqlManager = mySQLConnection;
    this.queryRunners = {};
  }

  public static getInstance(): ManagerConnection {
    if (!ManagerConnection.instance) {
      ManagerConnection.instance = new ManagerConnection();
    }

    return ManagerConnection.instance;
  }

  createNewQueryRunner(): { queryRunner: QueryRunner; id: string } {
    const queryRunner = this.mySqlManager.createQueryRunner();
    const id = uuid();
    this.queryRunners[id] = queryRunner;
    return {
      queryRunner,
      id,
    };
  }

  getQueryRunner(id: string): { queryRunner: QueryRunner; id: string } {
    const queryRunner = this.queryRunners?.[id];
    return {
      queryRunner,
      id,
    };
  }

  async closeQueryRunner(id: string): Promise<void> {
    const queryRunner = this.queryRunners?.[id];
    if (!queryRunner || queryRunner.isReleased) {
      delete this.queryRunners[id];
      return;
    }

    try {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
    } catch (err) {
      //
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
      delete this.queryRunners[id];
    }
  }
}
