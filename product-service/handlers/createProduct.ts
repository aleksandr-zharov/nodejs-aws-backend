import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {errorHandler, successHandler} from '../common/default';
import {createProduct} from "../services/products";

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    console.log('Event Body', event.body);
    const payload = JSON.parse(event.body);
    const result = await createProduct(payload);
    return successHandler(result);
  } catch (e) {
    return errorHandler(e);
  }
}
