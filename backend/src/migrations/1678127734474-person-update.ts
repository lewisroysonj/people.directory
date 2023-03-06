import { MigrationInterface, QueryRunner } from 'typeorm';

export class personUpdate1678127734474 implements MigrationInterface {
  name = 'personUpdate1678127734474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` DROP COLUMN \`phone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` ADD \`phone\` bigint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` DROP COLUMN \`phone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` ADD \`phone\` int NOT NULL`,
    );
  }
}
