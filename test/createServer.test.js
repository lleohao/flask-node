/// <reference path="../typings/index.d.ts" />
const Flask = require('../index');

var app = new Flask(__dirname);
app.run();