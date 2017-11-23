import { ServerResponse, OutgoingHttpHeaders } from 'http';
import { RenderFunction } from './render';

/**
 * Response data
 */
export interface ResponseData {
    /**
     * HTTP response entiry data
     */
    entiry: string;
    /**
     * HTTP status code
     */
    status: number;
    /**
     * HTTP headers
     */
    headers: Object;
}

/**
 * Custom cookies
 */
export interface CookieValue {
    /**
     * Cookie key
     */
    key: string;
    /**
     * Cookie value
     */
    value: string;
    /**
     * Cookie maxAge
     */
    maxAge?: number;
    /**
     * Cookie expires
     */
    expires?: number;
    /**
     * Cookie domain
     */
    domain?: string;
    /**
     * Cookie path
     */
    path?: string;
}

/**
 * Flask Response class
 */
export class Response {
    /**
     * Create Response instance
     * @param res
     * @param _render
     * @private
     */
    constructor(private res: ServerResponse, private _render: RenderFunction) {
        this.res = res;
        this._render = _render;
    }

    /**
     * finish HTTP request
     * @param status - HTTP status code
     * @param headers - HTTP headers
     * @param entiry - HTTP response entiry data
     */
    private finish(
        status: number,
        headers: OutgoingHttpHeaders,
        entiry?: Object
    ) {
        let res = this.res;

        headers = Object.assign({ 'Content-Type': 'text/html' }, headers);

        res.writeHead(status, headers);
        if (entiry !== undefined) res.write(entiry);

        res.end();
    }

    /**
     * Abort this request and return status code.
     * @param status - HTTP code
     * @example
     * ```
     * res.abort();
     * ```
     */
    abort(status = 401) {
        this.finish(status, {});
    }

    /**
     * End request with response.
     * @param response - response data
     * @param status - HTTP status code
     * @example
     * ```
     * res.end('Hello world');
     * ```
     */
    end(response: string | ResponseData, status: number = 200) {
        let entiry;
        let headers = {};

        if (typeof response === 'string') {
            entiry = response;
        } else {
            entiry = response.entiry;
            headers = response.headers;
            status = response.status;
        }

        this.finish(status, headers, entiry);
    }

    /**
     * Redirect with url.
     * @param url
     * @example
     * ```
     * res.redirect('https://lleohao.github.io')
     * ```
     */
    redirect(url: string) {
        let status = 301;
        let headers = {
            Location: url
        };

        this.finish(status, headers);
    }

    /**
     * Render template
     * @param templatePath - template path
     * @param data - template dynamic data
     */
    render(templatePath: string, data?: Object) {
        let response = this._render(templatePath, data);

        this.end(response);
    }

    /**
     * Set cookies
     * @param cookies
     * @example
     * ```
     * res.setCookie([{key: 'name', value: 'lleohao'}])
     * ```
     */
    setCookie(...cookies: CookieValue[]) {
        cookies.forEach(data => {
            let cookie = `${data.key}=${data.value}; `;

            if (data.maxAge !== undefined)
                cookie += `Max-Age = ${data.maxAge}; `;
            if (data.domain !== undefined)
                cookie += `Domain  = ${data.domain}; `;
            if (data.expires !== undefined)
                cookie += `Expires = ${data.expires}; `;
            if (data.path !== undefined) cookie += `Path    = ${data.path}; `;

            this.res.setHeader('Set-Cookie', cookie);
        });
    }
}
