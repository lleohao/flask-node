/// <reference path="../typings/index.d.ts" />
const Flask = require('../index');

let app = new Flask(__dirname);
let mainRouter = app.createRouter();
let render = app.createRender();


mainRouter.add("/", ["GET", "POST"], function (request, response) {
    console.log(request);
    response.setHeader("Set-Cookie", ["username=lleohao", "age=21"]);
    response.writeHead("200", { 'Content-Type': 'text/html' });
    response.end(render("from.html"));
})

app.run(debug = true);