/// <reference path="../typings/index.d.ts" />
const Flask = require('../index');

let app = new Flask(__dirname);
let mainRouter = app.createRouter();
let render = app.createRender();

// mainRouter.add("/", ["GET", "POST"], function (datagram, response) {
//     response.writeHead(200, { "Content-Type": "text/plain" });
//     let str = "pathname: " + datagram.pathname + "\n"
//     if (datagram.method === "GET") {
//         str += "query:" + datagram.search;
//         response.end(str);
//     } else {
//         str += "data:" + datagram.data;
//         response.end(str);
//     }
// })

// let adminRouter = app.createRouter("admin");
// adminRouter.add("/login", function(datagram, response) {
//     response.writeHead(200, { "Content-Type": "text/plain" });
//     response.end(datagram.pathname);
// })

mainRouter.add("/", ["GET", "POST"], function(datagram, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    if(datagram.method === "GET") {
        response.end(render("index.html", {
            title: "Hello world"
        }))
    } else {
        let username = datagram.data.toString("utf-8").split("=")[1];
        response.end(render("index.html", {
            title: "Hello world",
            username: username
        }))
    }
})
 
app.run(debug=true);