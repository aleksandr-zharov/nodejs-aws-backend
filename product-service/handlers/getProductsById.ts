import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { errorHandler, successHandler } from '../common/default';
import {DefaultError} from "../common/errors";
import {getProductById} from "../services/products";

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    const {id} =  event.pathParameters;
    const result = getProductById(id);
    if (!result) {
      throw new DefaultError("Product not found", 404);
    }
    return successHandler(result);
  } catch (e) {
    return errorHandler(e);
  }
}
