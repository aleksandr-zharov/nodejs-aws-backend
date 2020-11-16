import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWSMock from 'aws-sdk-mock';
import { handler } from './importProductsFile';
import {errorHandler, successHandler} from "../common/default";
import {DefaultError} from "../common/errors";

describe('importProductsFile', () => {
  it('should return signed url', async () => {
    const signedUrl = 'mockedUrl';
    AWSMock.mock('S3', 'getSignedUrl', (_operation, _params, cb) => {
      cb(null, signedUrl);
    });

    const response = await handler(({queryStringParameters: { name: 'name' }} as unknown) as APIGatewayProxyEvent, null,null);

    expect(response).toEqual(successHandler({signedUrl}));
  });

  it('should return error response', async () => {
    const response = await handler(({queryStringParameters: {}} as unknown) as APIGatewayProxyEvent, null, null);
    expect(response).toEqual(errorHandler(new DefaultError('Missing name query parameter', 400)));
  });
});
