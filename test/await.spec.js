import 'source-map-support/register';
import { Server } from 'hapi';
import Boom from 'boom';

import { assert } from 'chai';
import * as plugin from '../src/index';

class StubException extends Error {

}

function waitAndResolve(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function waitAndReject(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new StubException('Time out!'));
    }, ms);
  });
}

function waitAndRejectWithString(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Time out!');
    }, ms);
  });
}

describe('Test overjoy await functions with default function', () => {
  const server = new Server();
  server.connection({
    port: 0,
  });

  before(() => server.register({
    register: plugin,
  }));

  it('Should return with valid result if handler return an string', async () => {
    const data = 'OK';

    server.route({
      method: 'get',
      path: '/test-1',
      handler: {
        async await() {
          await waitAndResolve(1);
          return data;
        },
      },
    });

    const res = await server.inject({
      method: 'get',
      url: '/test-1',
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload, data);
  });

  it('Should return with valid result if handler return an json object', async () => {
    const data = {
      foo: 'bar',
      more: {
        nested: {
          property: 'OK',
        },
      },
    };

    server.route({
      method: 'get',
      path: '/test-2',
      handler: {
        async await() {
          await waitAndResolve(1);
          return data;
        },
      },
    });

    const res = await server.inject({
      method: 'get',
      url: '/test-2',
    });

    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.payload), data);
  });

  it('Should return 500 if handler throw an non-boom error', async () => {
    server.route({
      method: 'get',
      path: '/test-3',
      handler: {
        async await(req) {
          const { throwString } = req.query;

          if (throwString) {
            await waitAndRejectWithString(1);
          } else {
            await waitAndReject(1);
          }
        },
      },
    });

    {
      const res = await server.inject({
        method: 'get',
        url: '/test-3?throwString=true',
      });

      assert.equal(res.statusCode, 500);
    }

    {
      const res = await server.inject({
        method: 'get',
        url: '/test-3?throwString=false',
      });

      assert.equal(res.statusCode, 500);
    }
  });

  it('Should return error with status code match boom error if handler throw an boom error', async () => {
    const message = 'Not Found';

    server.route({
      method: 'get',
      path: '/test-4',
      handler: {
        async await() {
          throw Boom.notFound();
        },
      },
    });

    const res = await server.inject({
      method: 'get',
      url: '/test-4',
    });

    assert.equal(res.statusCode, 404);
    assert.equal(JSON.parse(res.payload).error, message);
  });

  it('Should return empty payload if handler return null or undefined', async () => {
    server.route({
      method: 'get',
      path: '/test-5',
      handler: {
        async await() {
          await waitAndResolve(1);
        },
      },
    });

    const res = await server.inject({
      method: 'get',
      url: '/test-5',
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload, '');
  });

  it('Should return empty payload if handler return null or undefined', async () => {
    server.route({
      method: 'get',
      path: '/test-6',
      handler: {
        async await() {
          await waitAndResolve(1);
        },
      },
    });

    const res = await server.inject({
      method: 'get',
      url: '/test-6',
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload, '');
  });

  it('Should work like normal handler if handler return response object', async () => {
    server.route({
      method: 'get',
      path: '/test-7',
      handler: {
        async await(req, reply) {
          return reply('OK').header('X-Awesome', 'Yes');
        },
      },
    });

    const res = await server.inject({
      method: 'get',
      url: '/test-7',
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload, 'OK');
    assert.equal(res.headers['x-awesome'], 'Yes');
  });
});
