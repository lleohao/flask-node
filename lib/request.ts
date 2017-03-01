import { IncomingMessage } from 'http';
import { parse as parseUrl, Url } from 'url';
import { parse } from 'querystring';

export interface FileObject {

}

export class Request {
    req: IncomingMessage;
    pathname: string;
    parser: Url;

    constructor(req: IncomingMessage) {
        let parser = this.parser = parseUrl(req.url);

        this.req = req;
        this.pathname = parser.pathname;
    }

    /**
     * return request headers
     * 
     * @param {string} name 
     * @returns 
     * 
     * @memberOf Request
     */
    headers(name?: string): Object | string {
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

    /**
     * get cookies
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    cookies(name?: string): Object | string {
        let cookieStr = <string>this.headers('cookie') || '';
        cookieStr = cookieStr.split('; ').join('&');

        let cookies = parse(cookieStr);

        if (!name) {
            return cookies;
        } else {
            return cookies[name] || null;
        }
    }

    /**
     * parsed form data from POST or PUT requests
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    form(name: string) {

    }

    files(name: string): FileObject {
        let file: FileObject;
        return file;
    }

    /**
     * return querystring
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    args(name?: string): Object | string {
        let args = parse(this.parser.query);

        if (!name) {
            return args;
        } else {
            return args[name] || null;
        }
    }

    /**
     * contents of both form and args
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    values(name: string) {

    }
}
