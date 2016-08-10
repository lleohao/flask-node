/// <reference path="../typings/index.d.ts" />

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

let routeHandle = function (debug) {
    return function (datagram, response) {
        if (routeMap[datagram.pathname] === undefined) {
            if (debug) console.warn('[router.js 41] The pathname: ' + datagram.pathname + ' is not found');
            response.writeHead(404, { 'Contet-type': 'text/plain' });
            response.end("404 Not Found");
        } else if (routeMap[datagram.pathname].allowed.indexOf(datagram.method) === -1) {
            if (debug) console.warn('[router.js 45] The pathname: ' + datagram.pathname + ' method: ' + datagram.method + ' is not allowed');
            response.writeHead(405, { 'Contet-type': 'text/plain' });
            response.end(datagram.method + " request is not allowed");
        } else {
            routeMap[datagram.pathname].callback(datagram, response);
        }
    }
}

module.exports = {
    routeHandle: routeHandle,
    Router: Router
};