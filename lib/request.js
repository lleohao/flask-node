"use strict";
const parseurl = require("parseurl");
class Request {
    constructor(req) {
        let parser = parseurl(req);
        this.req = req;
        this.method = req.method;
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
    form(name) {
    }
    args(name) {
    }
    values(name) {
    }
    files() {
    }
    cookies(name) {
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map