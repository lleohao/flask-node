/// <reference path='../typings/index.d.ts' />
const tool = require('./help/tools');

let routeMap = {};
let Router = function (prefix) {
    this.prefix = prefix || '';
};

Router.prototype.add = function (path, methods, callback) {
    // 自动补全前缀
    let _path = this.prefix ? '/' + this.prefix + path : path;
    this.warnEqualPath(path);
    routeMap[_path] = {callback: null, allowed: null};
    if (callback === undefined) {
        routeMap[_path].callback = methods;
        routeMap[_path].allowed = ['GET'];
    } else {
        routeMap[_path].callback = callback;
        routeMap[_path].allowed = methods;
    }
};

Router.prototype.warnEqualPath = function (path) {
    if (routeMap[path] !== undefined) {
        console.warn('[router.js 34] The path: ' + path + 'is present in routeMap');
    }
};

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
        routeMap[req.pathname].callback(req, response);
    }
};

module.exports = {
    routeHandle: routeHandle,
    Router: Router
};