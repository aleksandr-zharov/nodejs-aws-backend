import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { errorHandler, successHandler } from '../common/default';
const data = require('../data/products.json');

export const handler : APIGatewayProxyHandler = async () => {
  try {
    return successHandler(data);
  } catch (e) {
    return errorHandler(e);
  }
}
