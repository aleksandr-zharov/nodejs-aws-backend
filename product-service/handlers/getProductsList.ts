import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
const data = require('../data/products.json');

export const handler : APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(data),
  };
}
