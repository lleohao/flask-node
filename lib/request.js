"use strict";
const url_1 = require("url");
const querystring_1 = require("querystring");
class Request {
    constructor(req) {
        let parser = this.parser = url_1.parse(req.url);
        this.req = req;
        this.pathname = parser.pathname;
    }
    headers(name) {
        let lc = name.toLowerCase();
        let headers = this.req.headers;
        switch (lc) {
            case 'referer':
            case 'referrer':
                return headers.referrer || headers.referer;
            default:
                return headers[lc];
        }
    }
    cookies(name) {
        let cookieStr = this.headers('cookie') || '';
        cookieStr = cookieStr.split('; ').join('&');
        let cookies = querystring_1.parse(cookieStr);
        if (!name) {
            return cookies;
        }
        else {
            return cookies[name] || null;
        }
    }
    form(name) {
    }
    files(name) {
        let file;
        return file;
    }
    args(name) {
        let args = querystring_1.parse(this.parser.query);
        if (!name) {
            return args;
        }
        else {
            return args[name] || null;
        }
    }
    values(name) {
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map