/// <reference path="../typings/index.d.ts" />
const server = require('../server/createServer');

console.log('Server in runing on port: 8000');
server.listen(8000);