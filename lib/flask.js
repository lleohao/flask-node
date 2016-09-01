/// <reference path='../typings/index.d.ts' />
const http = require('http');
const global = require('./global');
const tools = require('./help/tools');
const staticServer = require('./static');
const requestFactory = require('./request');

/**
 * Flask 类
 *
 * @param rootPath 项目根路径
 * @param configs 项目配置
 * @constructor Flask
 *
 * config {
 *  static: "static path"
 *  templatesPath: "templates path"
 *  tmpDir: tmp directory
 *  formOption: formidable config
 * }
 */
function Flask(rootPath, configs) {
    if (rootPath === undefined || typeof rootPath !== 'string') {
        throw TypeError('rootPath must be a string');
    }
    configs = configs || {};
    global.configs.rootPath = rootPath;
    global.setConfigs(configs);
}

Flask.prototype.__createServer = function () {
    return http.createServer((request, response) => {
        // 设置常用响应
        tools.setHeaders({
            'server': 'node/flask'
        }, response);

        if (global.runTimeConfig.debug)
            console.log(tools.colors.info('[%s] path: %s, method: %s'), (new Date()).toLocaleString(), request.url, request.method);

        let req = requestFactory(request, response);
        if (req.method === 'OPTIONS') {
            response.writeHead(200);
            response.end();
        }

        if (global.$Other.staticRegex.test(req.pathname)) {
            staticServer(req, response);
        } else {
            req.handleForm();
        }
    });
};

/**
 * 启动服务器
 *
 * @param options 运行时配置文件
 * options {
 *  debug: false
 *  port: 5050
 *  hostname: 127.0.0.1
 * }
 */
Flask.prototype.run = function (options) {
    global.runTimeConfig = Object.assign(global.runTimeConfig, options);

    let server = this.__createServer();
    server.listen(global.runTimeConfig.port, global.runTimeConfig.hostname);
    console.log(tools.colors.error('Server is running on http://%s:%s'), global.runTimeConfig.hostname, global.runTimeConfig.port);
};

module.exports = Flask;