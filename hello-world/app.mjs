/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm"; // ES Modules import

const ssm = new SSMClient();
const testVar = process.env.TEST_VAR;

export const lambdaHandler = async (event, context) => {
  
  //GET VALUES FROM AWS MANAGER PARAMETER STORE
  const cmd = await new GetParametersCommand({
    Names: ['dbname', 'dbpw'],
    WithDecryption: true,
  });
  const dbName = await ssm.send(cmd);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `hello everyone! ${testVar} - ${event.stageVariables?.API_TEST}`,
        dbName: dbName.Parameters[0].Value,
        dbPw: dbName.Parameters[1].Value,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
