/// <reference path="../typings/index.d.ts" />
const Flask = require('../lib').Flask;
const Router = require('../lib').Router;
const fs = require('fs');
const path = require('path');

let app = new Flask(__dirname);
let mainRoute = new Router();

mainRoute.add("/", function (req, res) {
    res.render('index.html');
});

mainRoute.add("/baidu", function(req, res) {
    res.redirect('http://www.baidu.com');
})

mainRoute.add("/view", function (req, res) {
    res.render('view.html');
});

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
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end("The server error");
                    } else {
                        response.writeHead(200, { 'Content-Type': 'text/plain' });
                        response.end("true");
                    }
                })
            })
        } else {
            fs.rename(_tmpPath, _movePath, function (err) {
                if (err) {
                    console.log(err);
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end("The server error");
                } else {
                    res.redirect('/view');
                }
            })
        }
    })
});

app.run();