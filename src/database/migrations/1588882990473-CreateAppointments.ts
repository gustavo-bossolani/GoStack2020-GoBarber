import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1588882990473
    implements MigrationInterface {
    /**
     *
     * O método UP realiza o que a migrations indica
     *
     * O método DOWN disfaz exatamente o que o método UP realiza
     */

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'appointments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'provider',
                        type: 'uuid',
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('appointments');
    }
}

/**
 * Você só pode alterar uma migration se o arquivo não for enviada para o controle de versão
 * ela deve existir apenas em sua máquina. Caso contrário é obrigatório criar uma nova migration
 */
