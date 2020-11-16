import AwsSdk from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { errorHandler, successHandler } from '../common/default';
import {DefaultError} from "../common/errors";

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;


export const handler : APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.queryStringParameters || !event.queryStringParameters.name) {
      throw new DefaultError('Missing name query parameter', 400);
    }
    const {name} = event.queryStringParameters;
    const s3 = new AwsSdk.S3({ region });

    const signedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucketName,
      ContentType: 'text/csv',
      Expires: 60,
      Key: `uploaded/${name}`,
    });

    return successHandler({ signedUrl });
  } catch (e) {
    return errorHandler(e);
  }
};
