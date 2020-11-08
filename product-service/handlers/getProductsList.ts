import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { errorHandler, successHandler } from '../common/default';
import {getProducts} from "../services/products";

export const handler : APIGatewayProxyHandler = async () => {
  try {
    const products = await getProducts();
    return successHandler(products);
  } catch (e) {
    return errorHandler(e);
  }
}
