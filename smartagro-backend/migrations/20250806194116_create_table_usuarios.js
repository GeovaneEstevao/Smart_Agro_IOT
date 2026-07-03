/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex, Promise) {
    return knex.schema.createTable('usuarios',
        table => {
            table.increments('idusuario')
            table.string('nome').notNull()
            table.string('cpf').notNull()
            table.string('telefone').notNull()
            table.string('email').notNull().unique()
            table.string('password').notNull()
        }
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex, Promise) {
    return knex.schema.dropTable('usuarios')
};
