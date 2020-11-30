import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler} from 'aws-lambda';

export const handler: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    const {authorizationToken, methodArn} = event;
    console.log(`authorizationToken: ${authorizationToken}, methodArn: ${methodArn}`);
    if (authorizationToken) {
      throw new Error("Unauthorized");
    }
    const principalId = authorizationToken.split(' ')[1];
    const buff = Buffer.from(principalId, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');
    console.log(`login: ${username}, password: ${password}`);

    return {
      principalId: principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: process.env.PASSWORD === password && process.env.USER === username ? 'Allow' : 'Deny',
            Resource: methodArn,
          },
        ],
      },
    };
  } catch (err) {
    throw new Error("Unauthorized");
  }
};
