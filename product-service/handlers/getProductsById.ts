import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { find } from 'lodash';
import { errorHandler, successHandler } from './default';
const data = require('../data/products.json');

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    const {id} =  event.pathParameters;
    return successHandler(find(data, (d) => d.id == id));
  } catch (e) {
    return errorHandler(e);
  }
}
