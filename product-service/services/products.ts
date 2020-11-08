import {builder, client} from './config';

export const getProducts = async () => {
    await client.connect();
    const query = builder
        .select(['id', 'name', 'description', 'category', 'size', 'color', 'gender', 'price', 'count'])
        .from('products')
        .innerJoin('stocks', 'products.id', 'stocks.product_id')
        .toString();

    try {
        const result = await client.query(query);
        return result.rows;
    } finally {
        await client.end();
    }
};

export const getProductById = async (id) => {
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
    } finally {
        await client.end();
    }
};

export const createProduct = async (payload) => {
    await client.connect();

    try {
        await client.query('BEGIN');
        const { name, description, category, size, color, gender, price } = payload;
        const query = builder
            .insert({ name, description, category, size, color, gender, price })
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

        return productInsertResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');

        throw err;
    } finally {
        await client.end();
    }
};
