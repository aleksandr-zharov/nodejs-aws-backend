import {builder, config} from './config';
import {Client} from 'pg';
import {DefaultError} from "../common/errors";

export const getProducts = async () => {
    const client = new Client(config);
    await client.connect();
    const query = builder
        .select(['id', 'name', 'description', 'category', 'size', 'color', 'gender', 'price', 'count'])
        .from('products')
        .innerJoin('stocks', 'products.id', 'stocks.product_id')
        .toString();

    try {
        const result = await client.query(query);
        return result.rows;
    } catch (e) {
        throw new DefaultError(e.toString(), 500);
    }
    finally {
        await client.end();
    }
};

export const getProductById = async (id) => {
    const client = new Client(config);
    await client.connect();

    const query = builder
        .select(['products.id', 'name', 'description', 'category', 'size', 'color', 'gender', 'price', 'count'])
        .from('products')
        .innerJoin('stocks', 'products.id', 'stocks.product_id')
        .where({ 'products.id': id })
        .toString();

    try {
        const result = await client.query(query);
        return result.rows[0];
    } catch (e) {
        throw new DefaultError(e.toString(), 500);
    } finally {
        await client.end();
    }
};

export const createProduct = async (payload) => {
    const client = new Client(config);
    await client.connect();

    try {
        await client.query('BEGIN');
        const query = builder
            .insert({
                name: payload.name,
                description: payload.description,
                category: payload.category,
                size: payload.size,
                color: payload.color,
                gender: payload.gender,
                price: payload.price
            })
            .into('products')
            .returning('id')
            .toString();

        const productInsertResult = await client.query(query);
        const createdProduct = productInsertResult.rows[0];

        const stockInsertQueryString = builder
            .insert({
                product_id: createdProduct.id,
                count: payload.count,
            })
            .into('stocks')
            .toString();

        await client.query(stockInsertQueryString);

        await client.query('COMMIT');

        const data = {...payload, id: productInsertResult.rows[0].id};

        return data;
    } catch (e) {
        await client.query('ROLLBACK');
        throw new DefaultError(e.toString(), 500);
    } finally {
        await client.end();
    }
};
