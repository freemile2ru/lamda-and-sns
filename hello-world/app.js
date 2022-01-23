// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
//config AWS

let response;

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
exports.lambdaHandler = async (event, context) => {
    try {
        const sns = new AWS.SNS({ region: process.env.AWS_REGION })
        // const ret = await axios(url);
        //publish endpoint
        if (event.httpMethod === "GET") {
            const params = {
                TopicArn: 'arn:aws:sns:us-east-1:399208244533:test-topic',
                Subject: 'How Far',
                Message: 'I dey'
            }

            response = await new Promise((resolve)=> {
                sns.publish(params, (err, data) => {
                    if (err) console.error(err)
                    resolve({
                        'statusCode': 200,
                        'body': JSON.stringify({
                            success: true,
                            data
                        })
                    })
                })
            })
        } else {
            //subscribe endpoint
            const params = {
                Protocol: 'EMAIL',
                TopicArn: 'arn:aws:sns:us-east-1:399208244533:test-topic',
                Endpoint: JSON.parse(event.body).email,
            }
            response = await new Promise ((resolve) => {
                sns.subscribe(params, (err, data) => {
                    if (err) console.error(err)
                    resolve({
                        'statusCode': 201,
                        'body': JSON.stringify({
                            success: true,
                            data
                        })
                    })
                })
            });
            
        }

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
