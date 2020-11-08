import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {errorHandler, successHandler} from '../common/default';
import {createProduct} from "../services/products";

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    const result = createProduct(event.body);
    return successHandler(result);
  } catch (e) {
    return errorHandler(e);
  }
}
