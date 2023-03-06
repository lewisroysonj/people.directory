import { MigrationInterface, QueryRunner } from 'typeorm';

export class personUpdate1678133090974 implements MigrationInterface {
  name = 'personUpdate1678133090974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`person\` ADD \`deletedAt\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` ADD \`deletedAt\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` DROP COLUMN \`deletedAt\``,
    );
    await queryRunner.query(`ALTER TABLE \`person\` DROP COLUMN \`deletedAt\``);
  }
}
