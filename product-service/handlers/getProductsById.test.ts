import { handler } from './getProductsById';

test('getProductsById should return product by id', async () => {
  const event: any = {
    pathParameters: {
      id: 2
    }
  };
  const context: any = {};
  const result: any = await handler(event, context, () => {});
  expect(JSON.parse(result.body).name).toBe('augue a');
});
