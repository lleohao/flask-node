/// <reference path="../../typings/index.d.ts" />
const Flask = require('../../lib').Flask;
const Router = require('../../lib').Router;
const fs = require('fs');
const path = require('path');

let app = new Flask(__dirname, {static: 'asset'});
let mainRoute = new Router();

mainRoute.add("/", function index(req, res) {
    res.render('index.html');
    // res.str('Hello world');
});

mainRoute.add("/view", function viewImg(req, res) {
    res.render('view.html');
});

mainRoute.add("/upload", ["POST"], function upload(req, res) {
    let _uploadFile = req.form.files.img;
    let _extname = _uploadFile.name.split(".")[1];
    let _tmpPath = _uploadFile.path;
    let _movePath = path.join(__dirname, 'asset/img', 'upload.' + _extname);
    fs.exists(_movePath, function (exists) {
        if (exists) {
            fs.unlink(_movePath, function () {
                fs.rename(_tmpPath, _movePath, function (err) {
                    if (err) {
                        console.log(err);
                        res.abort(500);
                    } else {
                        res.redirect('/view');
                    }
                })
            })
        } else {
            fs.rename(_tmpPath, _movePath, function (err) {
                if (err) {
                    console.log(err);
                    res.abort(500);
                } else {
                    res.redirect('/view');
                }
            })
        }
    })
});

app.run();