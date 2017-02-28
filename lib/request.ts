import { IncomingMessage } from 'http';
import * as parseurl from 'parseurl';

export class Request {
    req: IncomingMessage;
    method: string;
    pathname: string;

    constructor(req: IncomingMessage) {
        let parser = parseurl(req);

        this.req = req;
        this.method = req.method;
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

    /**
     * parsed form data from POST or PUT requests
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    form(name: string) {

    }

    /**
     * return querystring
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    args(name: string) {

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

    files() {
        
    }


    /**
     * get cookies
     * 
     * @param {string} name 
     * 
     * @memberOf Request
     */
    cookies(name: string) {

    }


}
