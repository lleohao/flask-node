/// <reference path="../typings/index.d.ts" />
const http = require("http");
const url = require("url");
const tools = require("./help/tools");
const createStaticServer = require("./static");
const global = require("./global");
const router = require("./router");


function Flask(rootPath, config) {
    this.rootPath = rootPath;
    this.config = {};
    Object.assign(this.config, global.filePath, config);
}

Flask.prototype.__createServer = function () {
    let rootPath = this.rootPath;
    let config = this.config;
    let staticServer = createStaticServer(rootPath, config);
    let server = http.createServer((request, response) => {
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
            staticServer(datagram, response, this);
        } else {
            request.on("data", (chunk) => {
                _data.push(chunk);
            });
            request.on("end", () => {

            })
        }
    });
    return server;
}

Flask.prototype.run = function (port = 5000, hostname = "localhost") {
    console.log("Server is runing on http://" + hostname + ":" + port);
    let server = this.__createServer();
    server.listen(port, hostname);
}

module.exports = Flask;