import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {errorHandler, successHandler} from '../common/default';
import {createProduct} from "../services/products";
import {DefaultError} from "../common/errors";
import {productScheme} from "../services/scheme";

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    console.log('Event Body', event.body);
    const payload = JSON.parse(event.body);

    const validationResult = productScheme.validate(payload);
    if (validationResult.error) {
      throw new DefaultError(`Product data is invalid: ${validationResult.error.toString()}`, 400);
    }
    const result = await createProduct(payload);
    return successHandler(result);
  } catch (e) {
    return errorHandler(e);
  }
}
