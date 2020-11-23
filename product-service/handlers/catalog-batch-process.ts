import {SQSEvent} from 'aws-lambda';
import {SNS} from 'aws-sdk';
import {errorHandler, successHandler} from "../../import-service/common/default";
import {createProduct} from "../services/products";
import {productScheme} from "../services/scheme";

export const handler = async (event: SQSEvent) => {
  try {
    console.log('Started reading messages');
    const list = [];
    for (const record of event.Records) {
      const product = JSON.parse(record.body);
      console.log('Creating product', product);
      const validationResult = productScheme.validate(product);
      if (!validationResult.error) {
        const result = await createProduct(product);
        list.push(result);
      } else {
        console.error('Invalid product', product);
      }
    }

    const sns = new SNS();
    sns.publish({
      Subject: 'Some products was added',
      Message: `${list} products have been created: ${list.map(r => r.id).join(', ')}.`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        numOfProducts: {
          DataType: 'Number',
          StringValue: JSON.stringify(list.length),
        },
      },
    }, () => {
      console.log('catalogBatchProcess sent message to you');
    });

    return successHandler({});
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};
