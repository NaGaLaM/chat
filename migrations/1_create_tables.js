import knex from 'knex';
import knexConfig from '../knex.configs';

async function up(pg) {
    return pg.schema
    .createTable('Users',(table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.string('email').notNullable().unique();
        table.string('activationLink');
        table.boolean('isActivated').defaultTo(false);
        table.dateTime('created_at').notNullable();
        table.dateTime('updated_at');
    })
    .createTable('messages',(table) => {
        table.increments('id').primary();
        table.integer('sender').unsigned().references('id').inTable('Users')
        table.integer('recipient').unsigned().references('id').inTable('Users')
        table.text('text').notNullable();
        table.dateTime('created_at').notNullable();
        })
}

async function init() {
    const pg = knex(knexConfig.development);
    try {
        await up(pg);
        console.log("Tables successfully created ...");
    } catch (error) {
        console.log(error);
    }
}

init();