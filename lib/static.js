/// <reference path='../typings/index.d.ts' />
const fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    buffer = require('buffer'),
    path = require('path'),
    http = require('http'),
    mime = require('mime'),
    utils = require('./utils/utils'),
    configs = require('./utils/configs');

const debug = configs.RunTime.debug;

const Static = function Static(options) {
    let defaultHeaders = {},
        cache = 3600;

    this.root = configs.Flask.root;
    this.options = options || {};
    this.options.headers = this.options.headers || {};

    if ('cache' in this.options) {
        if (typeof this.options.cache === 'number') {
            defaultHeaders['cache-control'] = 'max-age=' + this.cache;
        }
    }

    this.options.headers = Object.assign(defaultHeaders, this.options.headers);
};

/**
 * handle static file request
 *
 * @param req {Object}
 * @param res {Object}
 * @public
 * @returns
 */
Static.prototype.server = function server(req, res) {
    let that = this,
        promise = new EventEmitter(),
        pathname = path.resolve(path.join(this.root, path.normalize(req.pathname)));

    let finish = function (status, headers) {
        that.finish(status, headers, req, res, promise);
    };

    process.nextTick(function () {
        that.serverPath(pathname, 200, req, res, finish)
            .on('success', function (result) {
                promise.emit('success', result);
            })
            .on('error', function (err) {
                promise.emit('error');
            });
    });

    return promise;
};


/**
 * 根据路径选择相对应的处理函数
 *
 * @param {String} pathname
 * @param {number} status
 * @param {Object} req
 * @param {Object} res
 * @param {function} finish
 * @returns
 */
Static.prototype.serverPath = function (pathname, status, req, res, finish) {
    let that = this,
        promise = new EventEmitter();

    fs.stat(pathname, (e, stat) => {
        if (e) {
            finish(404, {});
        } else {
            that.respond(pathname, status, stat, req, res, finish);
        }
    });

    return promise;
};

/**
 * 处理请求
 *
 * @param {number} status 状态码
 * @param {String} file
 * @param {Object} stat
 * @param {Object} req
 * @param {Object} res
 * @param {function} finish
 */
Static.prototype.respond = function (file, status, stat, req, res, finish) {
    let mtime = Date.parse(stat.mtime),
        headers = {},
        clientEtag = req.headers['if-none-match'],
        clientMTime = Date.parse(req.headers['if-modified-since']),
        startByte = 0,
        length = stat.size,
        byteRange = this.parseByteRange(req, stat);

    // 处理存在 range 请求
    if (byteRange.vaild) {
        if (byteRange.to < length) {
            startByte = byteRange.from;
            length = byteRange.to - byteRange.from + 1;
            status = 206;

            headers['Content-Range'] = 'bytes ' + byteRange.from + '-' + byteRange.to + '/' + stat.size;
        } else {
            byteRange.vaild = false;
            console.log(utils.colors.warn('Range request exceeds file boundaries, goes until byte no'), byteRange.to, "against file size of", length, "bytes");
        }
    }

    if (!byteRange.vaild && req.headers['range']) {
        console.error(new Error('Range request present but invalid, might serve whole file instead'));
    }

    // 合并 headers 
    for (var k in this.options.headers) {
        headers[k] = this.options.headers[k]
    }

    for (var k in _headers) {
        headers[k] = _headers[k]
    }

    // 缓存控制
    headers['Etag'] = JSON.stringify([stat.ino, stat.size, mtime].join('-'));
    headers['Date'] = new (Date)().toUTCString();
    headers['Last-Modified'] = new (Date)(stat.mtime).toUTCString();
    headers['Content-Type'] = contentType;
    headers['Content-Length'] = length;

    if ((clientMTime || clientEtag) &&
        (!clientEtag || clientEtag === headers['Etag']) &&
        (!clientMTime || clientMTime >= mtime)) {
        ['Content-Encoding',
            'Content-Language',
            'Content-Length',
            'Content-Location',
            'Content-MD5',
            'Content-Range',
            'Content-Type',
            'Expires',
            'Last-Modified'].forEach(function (entityHeader) {
            delete headers[entityHeader];
        });
        finish(304, headers);
    } else {
        res.writeHead(status, headers);

        this.stream(file, length, startByte, res, function (e) {
            if (e) {
                return finish(500, {})
            }
            finish(status, headers);
        })
    }
};

/**
 * 统一结束请求函数
 *
 * @param {number} status
 * @param {Object} headers
 * @param {Object} req
 * @param {Object} res
 * @param {Object} promise
 */
Static.prototype.finish = function (status, headers, req, res, promise) {
    let result = {
        status: status,
        headers: headers,
        message: http.STATUS_CODES[status]
    };

    if (!status || status >= 400) {
        // 存在error事件处理
        if (promise.listeners('error').length > 0) {
            promise.emit('error', result);
        } else {
            res.writeHead(status, headers);
            res.end();
        }
    } else {
        if (status !== 200 || req.method !== 'GET') {
            res.writeHead(status, headers);
            res.end();
        }
        promise.emit('success', result);
    }
};

/**
 * 处理文件路径
 *
 * @param {String} pathname
 * @returns
 */
Static.prototype.resolve = function (pathname) {
    return path.resolve(path.join(this.root, pathname));
};

/**
 * 创建文件流
 *
 * @param {string} file
 * @param {number} length
 * @param {number} startByte
 * @param {Object} res
 * @param {function} callback
 */
Static.prototype.stream = function (file, length, startByte, res, callback) {
    fs.createReadStream(file, {
        flags: 'r',
        mode: 0666,
        start: startByte,
        end: startByte + (length ? length - 1 : 0)
    }).on('data', function (chunk) {
        if (chunk.length && offset < length && offset >= 0) {
            offset += chunk.length;
        }
    }).on('error', function (err) {
        callback(err);
        console.error(err);
    }).pipe(res, {end: false});
};

/**
 * 处理 range 请求
 *
 * @param {Object} req
 * @param {Object} stat
 * @returns
 */
Static.prototype.parseByteRange = function (req, stat) {
    let byteRange = {
        from: 0,
        to: 0,
        vaild: false
    };

    let rangeHeader = req.headers['range'];
    let flavor = 'bytes=';

    if (rangeHeader) {
        if (rangeHeader.indexOf(flavor) == 0 && rangeHeader.indexOf(',') == -1) {
            rangeHeader = rangeHeader.substr(flavor.length).split('-');
            byteRange.from = parseInt(rangeHeader[0]);
            byteRange.to = parseInt(rangeHeader[1]);

            if (isNaN(byteRange.from) && !isNaN(byteRange.to)) {
                byteRange.from = stat.size - byteRange.to;
                byteRange.to = stat.size ? size.size - 1 : 0;
            } else if (!isNaN(byteRange.from) && isNaN(byteRange.to)) {
                byteRange.to = stat.size ? stat.size - 1 : 0;
            }

            if (!isNaN(byteRange.from) && !!byteRange.to && 0 <= byteRange.from && byteRange.from < byteRange.to) {
                byteRange.vaild = true;
            } else {
                console.log(utils.colors.warn('Request contains invalid range header: '), rangeHeader);
            }
        } else {
            console.log(utils.colors.warn('Request contains unsupported range header: '), rangeHeader);
        }
    }

    return byteRange;
};

// @todo: 看情况添加 gzip 支持

module.exports = function () {
    let options = configs.Static;
    return new Static(options);
};