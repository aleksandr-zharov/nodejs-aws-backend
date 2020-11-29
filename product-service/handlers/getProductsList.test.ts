import { handler } from './getProductsList';

test('getProductsList should return products', async () => {
  const event: any = {};
  const context: any = {};
  const result: any = await handler(event, context, () => {});
  expect(JSON.parse(result.body).length).toBe(20);
});
