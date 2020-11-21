import {SQSEvent} from 'aws-lambda';
import {SNS} from 'aws-sdk';
import {errorHandler, successHandler} from "../common/default";
import {createProduct} from "../../product-service/services/products";

export const handler = async (event: SQSEvent) => {
  try {
    const result = [];
    event.Records.
        map(async({body}) => {
          const res = await createProduct(body);
          result.push(res);
        });

    const sns = new SNS();
    sns.publish({
      Subject: 'Some products was added',
      Message: `${result} products have been created: ${result.map(r => r.id).join(', ')}.`,
      TopicArn: process.env.SNS_ARN,
    }, () => {
      console.log('catalogBatchProcess sent message to you');
    });

    return successHandler({});
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};
