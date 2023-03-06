import { MigrationInterface, QueryRunner } from 'typeorm';

export class person1678126633019 implements MigrationInterface {
  name = 'person1678126633019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`person\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`age\` int NULL, \`gender\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d2d717efd90709ebd3cb26b936\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`contact_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`street\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`zip\` int NOT NULL, \`country\` varchar(255) NOT NULL, \`phone\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`personId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` ADD CONSTRAINT \`FK_eb0c58f61fd2c16032e6171c2c6\` FOREIGN KEY (\`personId\`) REFERENCES \`person\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contact_info\` DROP FOREIGN KEY \`FK_eb0c58f61fd2c16032e6171c2c6\``,
    );
    await queryRunner.query(`DROP TABLE \`contact_info\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d2d717efd90709ebd3cb26b936\` ON \`person\``,
    );
    await queryRunner.query(`DROP TABLE \`person\``);
  }
}
