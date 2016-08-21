/// <reference path='../typings/index.d.ts' />
const tool = require('./help/tools');
const responseFactory = require('./response');
const global = require('./global');

let routeMap = {};
let Router = function (prefix) {
    this.prefix = prefix || '';
};

/**
 * 添加对应路径处理函数
 *
 * @param path 路径
 * @param methods 可接受的请求方式
 * @param handle 处理函数
 */
Router.prototype.add = function (path, methods, handle) {
    // todo: 添加 /user/<username> 支持
    let _path = this.prefix ? '/' + this.prefix + path : path;
    this._warnEqualPath(path);
    routeMap[_path] = {callback: null, allowed: null};
    if (handle === undefined) {
        routeMap[_path].callback = methods;
        routeMap[_path].allowed = ['GET'];
    } else {
        routeMap[_path].callback = handle;
        routeMap[_path].allowed = methods;
    }
};

/**
 * 内部函数：警告相同路径有不同的处理函数
 *
 * @param path 路径
 */
Router.prototype._warnEqualPath = function (path) {
    if (routeMap[path] !== undefined) {
        console.warn('[router.js 34] The path: ' + path + 'is present in routeMap');
    }
};

/**
 * 路径处理
 *
 * @param req 请求对象
 * @param response 相应对象
 */
let routeHandle = function (req, response) {
    if (routeMap[req.pathname] === undefined) {
        console.log(tool.colors.error('The pathname: %s is not found'), req.pathname);
        response.writeHead(404, {'Content-type': 'text/plain'});
        response.end('404 Not Found');
    } else if (routeMap[req.pathname].allowed.indexOf(req.method) === -1) {
        console.log(tool.colors.error('The pathname: %s is not allowed %s request'), req.pathname, req.method);
        response.writeHead(405, {'Content-type': 'text/plain'});
        response.end(req.method + ' request is not allowed');
    } else {
        let res = new responseFactory(response);
        routeMap[req.pathname].callback(req, res);
    }
};

module.exports = {
    routeHandle: routeHandle,
    Router: Router
};