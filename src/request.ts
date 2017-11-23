import { IncomingMessage } from 'http';
import { parse as parseUrl, Url } from 'url';
import { parse } from 'querystring';

import { IncomingForm, Files, Fields, File } from 'formidable';

/**
 * Flask Request class
 */
export class Request {
    private req: IncomingMessage;
    private parser: Url;

    private formParse: IncomingForm;
    private formParseFiles: Files;
    private formParseFields: Fields;

    /**
     * Request pathname
     */
    pathname: string;

    /**
     * Request method
     */
    method: string;

    /**
     * Create Request instance
     * @param req
     * @private
     */
    constructor(req: IncomingMessage) {
        let parser = (this.parser = parseUrl(<string>req.url));

        this.req = req;
        this.method = (<string>req.method).toLowerCase();
        this.pathname = <string>parser.pathname;
        this.formParse = new IncomingForm();
    }

    /**
     * The method can get request querystring value.
     *
     * If param `name` is undefined, will return querystring object.
     *
     * @param name
     */
    public args(name?: string): Object | string {
        let args = parse(this.parser.query);

        if (!name) {
            return args;
        } else {
            return args[name] || null;
        }
    }

    /**
     * The method will return cookie value.
     *
     * If param `name` is undefined, will return cookie object.
     *
     * @param name
     */
    public cookies(name?: string): string | Object {
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
     * The method can get file from requests.
     *
     * **Must execute in parse callback**.
     *
     * @param name
     * @example
     * ```
     * req.parse(err => {
     *  if (!err) req.files('filename')
     * })
     * ```
     */
    public files(name: string): File {
        return this.formParseFiles[name];
    }

    /**
     * The method can parse form data from POST or PUT requests.
     *
     * **Must execute in parse callback**.
     *
     * @param name
     * @example
     * ```
     * req.parse(err => {
     *  if (!err) req.form('name')
     * })
     * ```
     */
    public form(name: string) {
        if (/^post$|^put$/.test(this.method)) {
            return this.formParseFields[name];
        } else {
            return this.args(name);
        }
    }

    /**
     * The method will return request headers.
     *
     * @param name
     */
    headers(name: string): string {
        let lc = name.toLowerCase();
        let headers = this.req.headers;

        switch (lc) {
            case 'referer':
            case 'referrer':
                return <string>headers.referrer || <string>headers.referer;
            default:
                return <string>headers[lc];
        }
    }

    /**
     * The method is parse HTTP body data.
     *
     * @param parseOk - Triggered when request parsing is complete
     */
    public parse(parseOk: (err: Error | null) => void) {
        if (/^post$|^put$/.test(this.method)) {
            this.formParse.parse(this.req, (err, fields, files) => {
                if (err) {
                    parseOk(err);
                } else {
                    this.formParseFiles = files;
                    this.formParseFields = fields;

                    parseOk(null);
                }
            });
        } else {
            parseOk(null);
        }
    }

    /**
     * The method will return request value from form and args.
     *
     * If the form and requestquery have same key, will return form data.
     *
     * **Must execute in parse callback**.
     *
     * @param name
     * @example
     * ```javascript
     * req.parse(err => {
     *      if (!err) req.values('name');
     * })
     * ```
     */
    values(name: string): string | Object | null {
        return this.form(name) || this.args(name) || null;
    }
}
