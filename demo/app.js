/// <reference path="../typings/index.d.ts" />
const Flask = require('../lib').Flask;
const Router = require('../lib').Router;
const fs = require('fs');
const path = require('path');

let app = new Flask(__dirname);
let mainRoute = new Router();

mainRoute.add("/", function (req, res) {
    res.$res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.end(render('index.html'));
    res.$res.end("ok");
});

mainRoute.add("/view", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.end(render('view.html'));
    res.end("ok1");
});

/*
mainRoute.add("/upload", ["POST"], function (req, res) {
    let _uploadFile = req.form.files.uploadFile;
    let _extname = _uploadFile.name.split(".")[1];
    let _tmpPath = _uploadFile.path;
    let _movePath = path.join(__dirname, 'static/img', 'upload.' + _extname);
    fs.exists(_movePath, function (exists) {
        if (exists) {
            fs.unlink(_movePath, function () {
                fs.rename(_tmpPath, _movePath, function (err) {
                    if (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end("The server error");
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end("true");
                    }
                })
            })
        } else {
            fs.rename(_tmpPath, _movePath, function (err) {
                if (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end("The server error");
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end("true");
                }
            })
        }
    })
});*/

app.run({debug: true});