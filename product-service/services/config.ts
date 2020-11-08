import knex from 'knex';
import {Client} from 'pg';

const config = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    user: process.env.DB_USER,
    host: 'rsdb.cjur5r3am16a.eu-west-1.rds.amazonaws.com',
    database: '',
    password: process.env.DB_PASSWORD,
    port: 5432,
};

export const client = new Client(config);
export const builder = knex({ client: 'pg' });
