import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration202505061724381746552278161
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`customer\` (
        \`id\` VARCHAR(50) NOT NULL,
        \`userName\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC) VISIBLE,
        UNIQUE INDEX \`userName_UNIQUE\` (\`userName\` ASC) VISIBLE,
        UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) VISIBLE)
      ENGINE = InnoDB;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`customer\`;
      `);
  }
}
