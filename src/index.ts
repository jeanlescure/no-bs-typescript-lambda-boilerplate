import { inspect } from 'util';
import fetch from 'node-fetch';

import {
  APIGatewayProxyHandlerV2,
} from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = (event, context, callback) => {
  (async () => {
    const json = await fetch('https://api.github.com/gists').then((r) => r.json());

    console.log('Random Gist:', json[0]);

    callback(null, inspect(event));
  })().catch((e) => {
    console.log(e);
    callback(inspect(e), {
      statusCode: 500,
      headers: {
        'content-type': 'text/plain',
      },
      body: 'Internal Server Error',
    });
  });
};
