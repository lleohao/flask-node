/**
 * Created by hzzhouhao1 on 2016/9/1.
 */
"use strict";

const Flask = require('../../lib').Flask;
const Router = require('../../lib').Router;

let app = new Flask(__dirname);
let router = new Router();

router.add('/', function index(req, res) {
    res.str('hello world');
});

router.add('/user/<username>', function user(req, res) {
    res.str('hello ' + result.username);
});

app.run();