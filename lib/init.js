/// <reference path="../typings/index.d.ts" />
const http = require("http");
const url = require("url");
const tools = require("./help/tools");
const global = require("./global");
const createStaticServer = require("./static");
const route = require("./router");
const render = require("./render");
const requestFactory = require("./request");

let debug = false;
if (process.env.NODE_ENV === "development") debug = true;

function Flask(rootPath, config) {
    this.rootPath = rootPath;
    this.config = {};
    Object.assign(this.config, global.filePath, config);
}

Flask.prototype.__createServer = function () {
    let rootPath = this.rootPath;
    let config = this.config;
    let staticServer = createStaticServer(rootPath, config, this.__debug);
    let routeHandle = route.routeHandle;

    /**
     * 初始化服务器
     */
    let server = http.createServer((request, response) => {
        // 设置常用响应
        tools.setHeaders({
            "server": "node/flask"
        }, response);

        if (debug) {
            // 显示访问路径
            console.log("[init.js 29] " + (new Date()).toLocaleString() + " path: " + request.url + " " + request.method);
        }

        let req = requestFactory(request);
        if (req.method === "OPTIONS") {
            response.writeHead(200);
            response.end();
        }


        if (tools.staticMatch.test(req.url)) {
            staticServer(req, response, this);
        } else {
            routeHandle(req, response);
        }
    });
    return server;
}

Flask.prototype.createRouter = function (prefix) {
    return new route.Router(prefix);
}

Flask.prototype.createRender = function () {
    return render(this.rootPath, this.config);
}

Flask.prototype.run = function (options) {
    let _options = {
        port: 5000,
        hostname: "localhost",
    };
    Object.assign(_options, options);
    console.log("Server is runing on http://" + _options.hostname + ":" + _options.port);
    let server = this.__createServer();
    server.listen(_options.port, _options.hostname);
}

module.exports = Flask;