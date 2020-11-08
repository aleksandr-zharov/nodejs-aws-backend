import knex from 'knex';
import {Pool} from 'pg';

const config = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    user: process.env.DB_USER,
    host: 'rsdb.cjur5r3am16a.eu-west-1.rds.amazonaws.com',
    database: '',
    password: process.env.DB_PASSWORD,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

export const pool = new Pool(config);
export const builder = knex({ client: 'pg' });
