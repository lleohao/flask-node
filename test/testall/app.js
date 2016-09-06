/**
 * Created by hzzhouhao1 on 2016/9/1.
 */
"use strict";

const Flask = require('../../lib').Flask;
const Router = require('../../lib').Router;

let app = new Flask(__dirname);
let router = new Router();

router.add('/', function (req, res) {
    res.str('hello world');
});

router.add('/user/<username>', function (req, res, params) {
    res.str('hello ' + params.username);
});

app.run();