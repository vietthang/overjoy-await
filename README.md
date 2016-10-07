# overjoy-await

ES7 async/await route handler plugin for hapi.js.

[![NPM](https://nodei.co/npm/overjoy-await.png?downloads=true&stars=true)](https://nodei.co/npm/overjoy-await/)

## How to use

### Register plugin

```javascript
const Hapi = require('hapi');
const server = new Hapi.Server();

server.register({
  register: require('overjoy-await')
});
```

### Options
* `handlerName` - hapi handler name for plugin. Default to `await`.

### Add server route handler (simple)

```javascript
server.route({
  method: 'GET',
  path: '/sample',
  handler: {
    async await(req) {
      const result1 = await doSomethingAsync();
      const result2 = doSomethingMore(result1);
      const result3 = await continueWithSomethingAsync(result2);
      return result3
    }
  }
});
```

For more usages, please take a look at test directory.
