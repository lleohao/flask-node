/// <reference path="../typings/index.d.ts" />
const Flask = require('../index');

let app = new Flask(__dirname);
let mainRouter = app.createRouter();
let adminRouter = app.createRouter("admin");

mainRouter.add("/", ["GET", "POST"], function (datagram, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    let str = "pathname: " + datagram.pathname + "\n"
    if (datagram.method === "GET") {
        str += "query:" + datagram.search;
        response.end(str);
    } else {
        str += "data:" + datagram.data;
        response.end(str);
    }
})

adminRouter.add("/login", function(datagram, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(datagram.pathname);
})

app.run(debug=true);