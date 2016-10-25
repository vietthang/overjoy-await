/**
 * Check if a object is a Hapi response object
 * @param  {Any} value Any value to check
 * @return {Boolean}
 */
function isResponse(value, request) {
  return value && value.request === request;
}

export function register(server, { handlerName = 'await' }, next) {
  server.handler(handlerName, (route, asyncHandler) =>
    (request, reply) => {
      asyncHandler.bind(this)(request, reply).then((result) => {
        // just skip if the result returned is Hapi response
        if (isResponse(result, request)) {
          return;
        }

        // send empty response if result is null or undefined
        if (result === null || result === undefined) {
          reply();
        } else {
          reply(result);
        }
      }).catch((error) => {
        if (error instanceof Error) {
          const { name, message, stack } = error;
          request.log(['error', 'uncaught'], { name, message, stack });
          reply(error);
        } else {
          request.log(['error', 'uncaught'], { name: 'Error', message: error });
          reply(new Error(error));
        }
      });
    }
  );

  next();
}

register.attributes = {
  name: 'overjoy-await',
  version: '0.0.1',
};
