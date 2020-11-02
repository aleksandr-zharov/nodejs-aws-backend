import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { find } from 'lodash';
import { errorHandler, successHandler } from '../common/default';
import {DefaultError} from "../common/errors";
const data = require('../data/products.json');

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    const {id} =  event.pathParameters;
    const result = find(data, (d) => d.id == id);
    if (!result) {
      throw new DefaultError("Product not found", 404);
    }
    return successHandler(result);
  } catch (e) {
    return errorHandler(e);
  }
}
