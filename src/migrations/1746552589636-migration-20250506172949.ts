import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration202505061729491746552589636
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`auction_bet\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`auction\` INT UNSIGNED NOT NULL,
        \`customer\` VARCHAR(50) NOT NULL,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC) VISIBLE,
        INDEX \`auction_bet_ibfk1_idx\` (\`customer\` ASC) VISIBLE,
        INDEX \`auction_bet_ibfk2_idx\` (\`auction\` ASC) VISIBLE,
        CONSTRAINT \`auction_bet_ibfk1\`
          FOREIGN KEY (\`customer\`)
          REFERENCES \`customer\` (\`id\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT \`auction_bet_ibfk2\`
          FOREIGN KEY (\`auction\`)
          REFERENCES \`auction\` (\`id\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
      ENGINE = InnoDB;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`auction_bet\`;
      `);
  }
}
