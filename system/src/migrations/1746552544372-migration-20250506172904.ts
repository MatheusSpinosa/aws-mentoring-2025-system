import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration202505061729041746552544372
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`auction\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`customer\` VARCHAR(50) NOT NULL,
      \`name\` VARCHAR(100) NOT NULL,
      \`image\` VARCHAR(250) NOT NULL,
      \`winner\` VARCHAR(50) NULL,
      \`startDate\` TIMESTAMP NOT NULL,
      \`endDate\` TIMESTAMP NULL,
      \`counter\` INT NOT NULL,
      \`status\` ENUM('a', 'i', 'e') NOT NULL COMMENT 'Status (a)active, (i)inactive, (e)ended',
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC) VISIBLE,
      INDEX \`startDate_idx\` (\`startDate\` ASC) VISIBLE,
      INDEX \`endDate_idx\` (\`endDate\` ASC) VISIBLE,
      INDEX \`status_idx\` (\`status\` ASC) VISIBLE,
      INDEX \`auction_ibfk1_idx\` (\`winner\` ASC) VISIBLE,
      CONSTRAINT \`auction_ibfk1\`
        FOREIGN KEY (\`winner\`)
        REFERENCES \`customer\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT \`auction_ibfk2\`
          FOREIGN KEY (\`customer\`)
          REFERENCES \`customer\` (\`id\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
    ) ENGINE = InnoDB;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`auction\`;
      `);
  }
}
