import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1588907031862
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Deletando a coluna antiga
        await queryRunner.dropColumn('appointments', 'provider');

        // Criando a nova coluna
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // Criando a chave estrangeira
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                /**
                 * Apelido dado a ForeignKey que está sendo criada,
                 * basicamente a coluna que está sendo criada será
                 * armazenada em uma 'variável com o mesmo nome de name.
                 */
                name: 'AppointmentProvider',

                // Qual a coluna que receberá a chave estrangeira
                columnNames: ['provider_id'],

                /**
                 * Qual o nome da coluna na tabela de usuário que vai
                 * representar o provider_id (relacionado)
                 *
                 * Qual nome da coluna que o provider_id vai receber o valor?
                 */
                referencedColumnNames: ['id'],

                // Nome da tabela que vai fazer a referencia com o campo
                referencedTableName: 'users',

                /**
                 * Estratégia de CASCADE on ..
                 *
                 * RESTRICT: Não deixa ser deletado,
                 * SET NULL: Altera o campo para nulo
                 * CASCADE: Deletou/Atualizou? vou deletar os relacionamentos
                 */
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
        await queryRunner.dropColumn('appointments', 'provider_id');
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider',
                type: 'varchar',
            }),
        );
    }
}
