/// <reference path="../typings/index.d.ts" />
const Flask = require("../");

let app = new Flask(__dirname);
let mainRoute = app.createRouter();
let render = app.createRender();

mainRoute.add("/", function(data, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(render("index.html"));
});

mainRoute.add("/upload", ["GET", "POST"], function(data, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("/upload");
});


app.run({port: 8000,debug: true});