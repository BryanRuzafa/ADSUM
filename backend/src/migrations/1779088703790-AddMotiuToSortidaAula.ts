import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMotiuToSortidaAula1779088703790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sortides_aula\` ADD \`motiu\` ENUM('bany', 'secretaria', 'infermeria', 'altres') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sortides_aula\` DROP COLUMN \`motiu\``,
    );
  }
}
