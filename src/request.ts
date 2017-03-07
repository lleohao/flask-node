import { IncomingMessage } from 'http';
import { parse as parseUrl, Url } from 'url';
import { parse } from 'querystring';

import { IncomingForm, Files, Fields, File } from 'formidable';

export class Request {
    private req: IncomingMessage;
    pathname: string;
    method: string;
    private parser: Url;

    private formParse: IncomingForm;
    private formParseFiles: Files;
    private formParseFields: Fields;

    constructor(req: IncomingMessage) {
        let parser = this.parser = parseUrl(req.url);

        this.req = req;
        this.method = req.method.toLowerCase();
        this.pathname = parser.pathname;
        this.formParse = new IncomingForm();
    }

    parse(parseOk: Function) {
        if (/^post$|^put$/.test(this.method)) {
            this.formParse.parse(this.req, (err, fields, files) => {
                if (err) {
                    // TODO: add error function
                } else {
                    this.formParseFiles = files;
                    this.formParseFields = fields;

                    parseOk();
                }
            })
        } else {
            parseOk();
        }
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
    cookies(name?: string): string | Object {
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
        if (/^post$|^put$/.test(this.method)) {
            return this.formParseFields[name];
        } else {
            return this.args(name);
        }
    }

    files(name: string): File {
        return this.files[name];
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
        return this.form(name) || this.args(name) || null;
    }
}