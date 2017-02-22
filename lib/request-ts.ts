import { IncomingMessage } from 'http';
import { parse } from 'querystring';
import * as parseurl from 'parseurl';

export class Request {
    req: IncomingMessage;
    cookies: Object;
    method: string;
    pathname: string;
    form: Object;

    constructor(req: IncomingMessage) {
        let rawCookie = req.headers.cookie || '';
        let parser = parseurl(req);

        this.req = req;
        this.method = req.method;
        this.pathname = parser.pathname;
        this.cookies = parse(rawCookie.replace('; ', '&'));
    }

    headers(name: string) {
        let lc = name.toLowerCase();
        let headers = this.req.headers;

        switch (lc) {
            case 'referer':
            case 'referrer':
                return headers.referrer || headers.referer;
            default:
                return headers[lc]
        }
    }
}
