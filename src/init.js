/// <reference path="../typings/index.d.ts" />
const http = require("http");
const url = require("url");
const tools = require("./help/tools");
const global = require("./global");
const createStaticServer = require("./static");
const route = require("./router");


function Flask(rootPath, config) {
    this.rootPath = rootPath;
    this.config = {};
    Object.assign(this.config, global.filePath, config);
}

Flask.prototype.__createServer = function () {
    let rootPath = this.rootPath;
    let config = this.config;
    let staticServer = createStaticServer(rootPath, config, this.__debug);
    let routeHandle = route.routeHandle(this.__debug);
    let server = http.createServer((request, response) => {
        // 设置常用响应
        tools.setHeaders({
            "server": "node/flask",
            "allow": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }, response);

        if (this.__debug) {
            console.log((new Date()).toLocaleString + " path: " + request.url + " " + request.method);
        }

        if (request.method === "OPTIONS") {
            response.writeHead(200);
            response.end();
        }

        let _url = url.parse(request.url, true);
        let _data = [];
        let datagram = {
            pathname: _url.pathname,
            query: _url.query,
            search: _url.search,
            method: request.method,
            headers: request.headers
        }

        if (tools.staticMatch.test(datagram.pathname)) {
            staticServer(datagram, response, this);
        } else {
            request.on("data", (chunk) => {
                _data.push(chunk);
            });
            request.on("end", () => {
                routeHandle(datagram, response);
            })
        }
    });
    return server;
}

Flask.prototype.createRouter = function (prefix) {
    return new route.Router(prefix);
}

Flask.prototype.run = function (options) {
    let _options = {
        port: 5000,
        hostname: "localhost",
        debug: false
    };
    Object.assign(_options, options);
    console.log("Server is runing on http://" + _options.hostname + ":" + _options.port);
    if (_options.debug) {
        this.__debug = true;
    }
    let server = this.__createServer();
    server.listen(_options.port, _options.hostname);
}

module.exports = Flask;