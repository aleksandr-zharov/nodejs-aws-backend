import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
const data = require('../data/products.json');

export const handler : APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
