import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration202505061731101746552670866
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`coupon\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`code\` VARCHAR(45) NOT NULL,
        \`bets\` INT UNSIGNED NOT NULL,
        \`maxUse\` INT NOT NULL,
        \`status\` ENUM('a', 'i') NOT NULL,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC) VISIBLE,
        UNIQUE INDEX \`code_UNIQUE\` (\`code\` ASC) VISIBLE,
        INDEX \`status_idx\` (\`status\` ASC) VISIBLE)
      ENGINE = InnoDB;
      `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`coupon_use\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`customer\` VARCHAR(50) NOT NULL,
        \`coupon\` INT UNSIGNED NOT NULL,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC) VISIBLE,
        INDEX \`coupom_use_ibfk1_idx\` (\`customer\` ASC) VISIBLE,
        INDEX \`coupom_use_ibfk2_idx\` (\`coupon\` ASC) VISIBLE,
        CONSTRAINT \`coupon_use_ibfk1\`
          FOREIGN KEY (\`customer\`)
          REFERENCES \`customer\` (\`id\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT \`coupon_use_ibfk2\`
          FOREIGN KEY (\`coupon\`)
          REFERENCES \`coupon\` (\`id\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
      ENGINE = InnoDB;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`coupon\`;
      `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`coupon_use\`;
      `);
  }
}
