import { APIGatewayProxyHandler } from 'aws-lambda';
import AwsSdk from 'aws-sdk';
import 'source-map-support/register';
import { errorHandler, successHandler } from '../common/default';
import {DefaultError} from "../common/errors";

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const uploadedPrefix = process.env.S3_UPLOADED_PREFIX;


export const handler : APIGatewayProxyHandler = async (event) => {
  const {name} = event.queryStringParameters;

  try {
    if (!name) {
      throw new DefaultError('Missing name query parameter', 400);
    }

    const key = uploadedPrefix + name;
    const s3 = new AwsSdk.S3({ region });

    const signedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucketName,
      ContentType: 'text/csv',
      Expires: 60,
      Key: key,
    });

    return successHandler({ signedUrl });
  } catch (e) {
    return errorHandler(e);
  }
};
