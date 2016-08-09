/// <reference path="../typings/index.d.ts" />
const http = require("http");
const url = require("url");
const tools = require("./help/tools");
const staticServer = require("./static");


const server = http.createServer((request, response) => {
    // 设置常用响应
    tools.setHeaders({
        "server": "node/flask",
        "allow": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }, response);


    if (request.method === "OPTIONS") {
        response.writeHead(200);
        response.end();
    }

    let _url = url.parse(request.url, true);
    let _data = [];
    let datagram = {
        pathname: _url.pathname,
        query: _url.query,
        method: request.method.toLowerCase(),
        headers: request.headers
    }

    if (tools.staticMatch.test(datagram.pathname)) {
        staticServer(datagram, response);
    } else {
        request.on("data", (chunk) => {
            _data.push(chunk);
        });
        request.on("end", () => {
            
        })
    }
}
);


module.exports = server;