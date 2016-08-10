/// <reference path="../typings/index.d.ts" />

let debug = false;
if (process.env.NODE_ENV === "development") debug = true;
/**
 * 路由映射
 */
var routeMap = {}

/**
 * 路由处理类
 */
var Router = function (prefix) {
    this.prefix = prefix || "";
}

/**
 * 添加路由
 */
Router.prototype.add = function (path, methods, callback) {
    // 自动补全前缀
    let _path = this.prefix ? '/' + this.prefix + path : path;
    this.warnEqualPaht(path);
    routeMap[_path] = { callback: null, allowed: null }
    if (callback === undefined) {
        routeMap[_path].callback = methods;
        routeMap[_path].allowed = ["GET"];
    } else {
        routeMap[_path].callback = callback;
        routeMap[_path].allowed = methods;
    }
}

Router.prototype.warnEqualPaht = function (path) {
    if (routeMap[path] !== undefined) {
        console.warn("[router.js 34] The path: " + path + "is present in routeMap");
    }
}

let routeHandle = function (req, response) {
    if (routeMap[req.pathname] === undefined) {
        if (debug) console.warn('[router.js 41] The pathname: ' + req.pathname + ' is not found');
        response.writeHead(404, { 'Contet-type': 'text/plain' });
        response.end("404 Not Found");
    } else if (routeMap[req.pathname].allowed.indexOf(req.method) === -1) {
        if (debug) console.warn('[router.js 45] The pathname: ' + req.pathname + ' method: ' + req.method + ' is not allowed');
        response.writeHead(405, { 'Contet-type': 'text/plain' });
        response.end(req.method + " request is not allowed");
    } else {
        routeMap[req.pathname].callback(req, response);
    }
}

module.exports = {
    routeHandle: routeHandle,
    Router: Router
};