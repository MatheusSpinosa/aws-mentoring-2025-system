import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration202505061727381746552458446
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`bet_cash\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`customer\` VARCHAR(50) NOT NULL,
        \`amount\` INT UNSIGNED NOT NULL,
        \`type\` ENUM('c', 'd') NOT NULL,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC) VISIBLE,
        INDEX \`bet_cash_ibfk1_idx\` (\`customer\` ASC) VISIBLE,
        INDEX \`type_idx\` (\`type\` ASC) VISIBLE,
        CONSTRAINT \`bet_cash_ibfk1\`
          FOREIGN KEY (\`customer\`)
          REFERENCES \`customer\` (\`id\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
      ENGINE = InnoDB;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`bet_cash\`;
      `);
  }
}
