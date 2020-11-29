import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {errorHandler, successHandler} from '../common/default';
import {createProduct} from "../services/products";
import {DefaultError} from "../common/errors";
import Joi from 'joi';

export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    console.log('Event Body', event.body);
    const payload = JSON.parse(event.body);

    // Venue data schema
    const productScheme = Joi.object().keys({
      id: Joi.any().optional(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      size: Joi.string().required(),
      color: Joi.string().required(),
      gender: Joi.string().required(),
      price: Joi.number().optional(),
      count: Joi.number().required()
    });

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
