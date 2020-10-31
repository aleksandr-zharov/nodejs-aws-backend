import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { find } from 'lodash';
const data = require('../data/products.json');

export const handler : APIGatewayProxyHandler = async (event) => {
  const {id} =  event.pathParameters;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(find(data, (d) => d.id == id)),
  };
}
