/// <reference path='../typings/index.d.ts' />
const http = require('http'),
    utils = require('./utils/utils'),
    configs = require('./utils/configs'),
    staticFactory = require('./static'),
    requestFactory = require('./request');

/**
 * Flask 类
 *
 * @param rootPath 项目根路径
 * @param options 项目配置
 * @constructor Flask
 *
 * config {
 *  static: "static path"
 *  templates: "templates path"
 *  temp: temp directory
 *  formOption: formidable config
 *  Static: static server config,
 * }
 */
function Flask(rootPath, options) {
    if (rootPath === undefined || typeof rootPath !== 'string') {
        throw TypeError('rootPath must be a string');
    }

    configs.Flask.root = rootPath;
    if (options) utils.setConfigs(options);
}

Flask.prototype.__createServer = function () {
    let staticServer = staticFactory(),
        staticRegex = new RegExp('^/' + configs.Flask.static + '/', 'i');

    return http.createServer((request, response) => {
        // 设置常用响应
        response.setHeader('server', 'node/flask');

        if (configs.RunTime.debug)
            console.log(utils.colors.info('[%s] path: %s method: %s'), (new Date()).toLocaleString(), request.url, request.method);

        let req = requestFactory(request, response);
        if (req.method === 'OPTIONS') {
            response.writeHead(200);
            response.end();
        }

        if (staticRegex.test(req.pathname)) {
            staticServer.server(req, response);
        } else {
            req.handleForm();
        }
    });
};

/**
 * 启动服务器
 *
 * @param options 运行时配置文件
 * @example
 *  app.run({
 *      debug: false,
 *      port: 5050,
 *      hostname: 127.0.0.1
 *  })
 */
Flask.prototype.run = function (options) {
    utils.setRunTime(options);

    let server = this.__createServer(),
        runTime = configs.RunTime;

    server.listen(runTime.port, runTime.hostname);

    console.log(utils.colors.error('Server is running on http://%s:%s'), runTime.hostname, runTime.port);
};

module.exports = Flask;