import { stat, createReadStream, Stats } from 'fs';
import { STATUS_CODES, ServerResponse } from 'http';
import { join, resolve } from 'path';

import * as mime from 'mime';

import { configs } from './flask';
import { Request } from './request';
import { HeaderValue } from './configs';

export class Sever {
    root: string;
    options: {
        cache?: number | boolean
        gzip?: boolean | RegExp
        headers?: HeaderValue
    };
    cache: number | boolean;
    defaultHeaders: HeaderValue

    staticUrlPathLen: number;

    constructor() {
        this.root = configs.flaskOptions.staticRootPath;
        this.options = configs.staticServerOptions;

        this.staticUrlPathLen = configs.flaskOptions.staticUrlPath.length + 2;
        this.defaultHeaders = {};


        if (this.options.cache === false) {
            this.cache = false;
        } else {
            this.cache = this.options.cache || 3600;
        }

        if (!configs.runTimeOptions.debug && this.cache !== false) {
            this.defaultHeaders['Cache-control'] = `max-age=${this.cache}`;
        } else {
            this.defaultHeaders['Cache-control'] = 'no store';
        }

        this.options.headers = Object.assign(this.options.headers, this.defaultHeaders);
    }

    serve(req: Request, res: ServerResponse) {
        let self = this;
        let pathname = req.pathname;

        let finish = function (status: number, headers: HeaderValue) {
            self.finish(status, headers, req, res);
        }

        process.nextTick(() => {
            this.servePath(pathname, {}, req, res, finish)
        })
    }

    private reslove(pathname: string) {
        pathname = pathname.substr(this.staticUrlPathLen)
        return resolve(join(this.root, pathname));
    }

    private finish(status: number, headers: HeaderValue, req: Request, res: ServerResponse) {
        if (status >= 400) {
            console.warn(`${req.pathname} ${status} ${STATUS_CODES[status]}`);
        }

        res.writeHead(status, headers);
        res.end();
    }

    private servePath(pathname: string, headers: HeaderValue, req: Request, res: ServerResponse, finish: Function) {
        pathname = this.reslove(pathname);

        if (pathname.indexOf(this.root) === 0) {
            stat(pathname, (e: Error, stat: Stats) => {
                if (e) {
                    finish(404, {})
                } else if (stat.isFile()) {
                    this.respond(headers, pathname, stat, req, res, finish)
                } else {
                    finish(400, {});
                }
            })
        } else {
            finish(403, {});
        }
    }

    private gzipOk(req: Request, contentType: string) {
        let enable = this.options.gzip;

        if (enable &&
            (typeof enable === 'boolean') ||
            (contentType && (enable instanceof RegExp) && enable.test(contentType))) {
            let acceptEncoding = <string>req.headers('accept-encoding');
            return acceptEncoding && acceptEncoding.indexOf('gzip') >= 0;
        }

        return false;
    }

    private parseByteRange(req: Request, stat: Stats) {
        let byteRange = {
            from: 0,
            to: 0,
            valid: false
        };

        let rangeHeader = req.headers('range');
        let flavor = 'bytes=';


        if (rangeHeader) {
            if (rangeHeader.indexOf(flavor) === 0 && rangeHeader.indexOf(',') === -1) {
                let rangeHeaderList = rangeHeader.substr(flavor.length).split('-');
                byteRange.from = parseInt(rangeHeaderList[0]);
                byteRange.to = parseInt(rangeHeaderList[1]);

                if (isNaN(byteRange.from) && !isNaN(byteRange.to)) {
                    byteRange.from = stat.size - byteRange.to;
                    byteRange.to = stat.size ? stat.size - 1 : 0;
                } else if (!isNaN(byteRange.from) && isNaN(byteRange.to)) {
                    byteRange.to = stat.size ? stat.size - 1 : 0;
                }

                if (!isNaN(byteRange.from) && !!byteRange.to && 0 <= byteRange.from && byteRange.from < byteRange.to) {
                    byteRange.valid = true;
                } else {
                    console.warn('Request contains invalid range header: ', rangeHeader);
                }
            } else {
                console.warn('Request contains unsupported range header: ', rangeHeader);
            }
        }
        return byteRange;
    }

    private respond(_headers: HeaderValue, filename: string, stat: Stats, req: Request, res: ServerResponse, finish: Function) {
        let contentType = mime.lookup(filename) || 'application/octet-stream';

        if (this.gzipOk(req, contentType)) {
            this.respondGzip(_headers, filename, contentType, stat, req, res, finish);
        } else {
            this.respondNoGzip(_headers, filename, contentType, stat, req, res, finish);
        }
    }

    private respondGzip(_headers: HeaderValue, filename: string, contentType: string, _stat: Stats, req: Request, res: ServerResponse, finish: Function) {
        let gzFile = filename + '.gz';
        stat(gzFile, (e, gzStat) => {
            if (!e && gzStat.isFile()) {
                let vary = _headers['Vary'];
                _headers['Vary'] = (vary && vary !== 'Accept-Encoding' ? vary + ', ' : '') + 'Accept-Encoding';
                _headers['Content-Encoding'] = 'gzip';
                _stat.size = gzStat.size;
                filename = gzFile;
            }

            this.respondNoGzip(_headers, filename, contentType, _stat, req, res, finish);
        })

    }

    private respondNoGzip(_headers: HeaderValue, filename: string, contentType: string, stat: Stats, req: Request, res: ServerResponse, finish: Function) {
        let mtime = Date.parse(stat.mtime.toString()),
            headers: HeaderValue = {},
            clientETag = req.headers('if-none-match'),
            clientMTime = Date.parse(<string>req.headers('if-modified-since')),
            startByte = 0,
            length = stat.size,
            byteRange = this.parseByteRange(req, stat);

        let status = 200;

        if (byteRange.valid) {
            if (byteRange.to < length) {
                startByte = byteRange.from;
                length = byteRange.to - byteRange.from + 1;
                status = 206;

                headers['Content-Range'] = 'bytes ' + byteRange.from + '-' + byteRange.to + '/' + stat.size;
            } else {
                byteRange.valid = false;
                console.warn('Range request exceeds file boundaries, goes until byte no', byteRange.to, 'against file size of', length, 'bytes');
            }
        }

        if (!byteRange.valid && req.headers('range')) {
            console.error(new Error('Range request present but invalid, might serve whole file instead'));
        }

        headers = Object.assign(this.options.headers, _headers);

        headers['Etag'] = JSON.stringify([stat.ino, stat.size, mtime].join('-'));
        headers['Date'] = new (Date)().toUTCString();
        headers['Last-Modified'] = new (Date)(stat.mtime).toUTCString();
        headers['Content-Type'] = contentType;
        headers['Content-Length'] = length.toString();

        if ((clientMTime || clientETag) &&
            (!clientETag || clientETag === headers['Etag']) &&
            (!clientMTime || clientMTime >= mtime)) {
            ['Content-Encoding',
                'Content-Language',
                'Content-Length',
                'Content-Location',
                'Content-MD5',
                'Content-Range',
                'Content-Type',
                'Expires',
                'Last-Modified'].forEach((entityHeader) => {
                    delete headers[entityHeader];
                });
            finish(304, headers);
        } else {
            res.writeHead(status, headers);

            this.stream(filename, length, startByte, res, (e: Error) => {
                if (e) { return finish(500, {}) }
                finish(status, headers);
            })
        }
    }

    private stream(filename: string, length: number, startByte: number, res: ServerResponse, callback: Function) {
        createReadStream(filename, {
            flags: 'r',
            mode: 0o666,
            start: startByte,
            end: startByte + (length ? length - 1 : 0)
        }).on('close', () => {
            res.end();
        }).on('error', (err: Error) => {
            callback(err);
            console.error(err);
        }).pipe(res, { end: false })
    }
}