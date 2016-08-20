/// <reference path='../typings/index.d.ts' />
const http = require('http');
const path = require('path');
const global = require('./global');
const tools = require('./help/tools');
const route = require('./router');
const render = require('./render');
const createStaticServer = require('./static');
const requestFactory = require('./request');

function Flask(rootPath, config) {
    this.config = {
        rootPath: rootPath
    };
    Object.assign(this.config, global.filePath, config);

    this.config.static = path.join(this.config.rootPath, this.config.static);
    this.config.tmpDir = path.join(this.config.rootPath, this.config.tmpDir);
    this.config.templates = path.join(this.config.rootPath, this.config.templates);
    if (this.config.form.autoSave) {
        this.config.form.uploadDir = path.join(this.config.rootPath, this.config.form.uploadDir);
    } else {
        this.config.form.uploadDir = this.config.tmpDir;
    }
}

Flask.prototype.__createServer = function (options) {
    let self = this;
    let config = self.config;
    let staticServer = createStaticServer(config, options);

    return http.createServer((request, response) => {
        // 设置常用响应
        tools.setHeaders({
            'server': 'node/flask'
        }, response);

        if (options.debug)
            console.log(tools.colors.info('[%s] path: %s, method: %s'), (new Date()).toLocaleString(), request.url, request.method);

        let req = requestFactory(request, response, config, options);
        if (req.method === 'OPTIONS') {
            response.writeHead(200);
            response.end();
        }

        if (tools.staticMatch.test(req.pathname)) {
            staticServer(req, response);
        } else {
            req.afterHandleForm();
        }
    });
};

Flask.prototype.createRouter = function (prefix) {
    return new route.Router(prefix);
};

Flask.prototype.createRender = function () {
    return render(this.config);
};

Flask.prototype.run = function (options) {
    let _options = {
        port: 5000,
        hostname: 'localhost',
        debug: false
    };
    Object.assign(_options, options);
    this.__options = _options;

    let server = this.__createServer(_options);
    server.listen(_options.port, _options.hostname);
    console.log(tools.colors.error('Server is running on http://%s:%s'), _options.hostname, _options.port);
};

module.exports = Flask;