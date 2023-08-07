import knex from 'knex';
import knexConfigs from '../knex.configs';

async function down(pg) {
    return pg.schema
    .dropTable('Users')
    .dropTable('messages')
}

async function init() {
    const pg = knex(knexConfigs.development);
    try {
        await down(pg);
        console.log("Tables succesfully deleted ...");
    } catch (error) {
        console.log(error);
    }
}

init()