/// <reference path='../typings/index.d.ts' />
const url = require('url');
const util = require('util');
const qs = require('querystring');
const router = require('./router');
const global = require('./global');
const formidable = require('formidable').IncomingForm;

/**
 * 格式化files 数据
 *
 * @param files 文件对象
 * @returns {{}}
 * @private
 */
const __formatFiles = function (files) {
    let key = Object.keys(files);
    let _files = {};

    key.map(function (value) {
        if (util.isArray(files[value])) {
            _files[value] = [];
            files[value].map(function (value) {
                _files[value].push = {
                    domain: value.domain,
                    size: value.size,
                    path: value.path,
                    name: value.name,
                    type: value.type,
                    lastModifiedDate: value.lastModifiedDate
                };
            });
        } else {
            _files[value] = {
                domain: files[value].domain,
                size: files[value].size,
                path: files[value].path,
                name: files[value].name,
                type: files[value].type,
                lastModifiedDate: files[value].lastModifiedDate
            };
        }
    });
    return _files;
};

module.exports = function (request, respone) {
    const _req = function () {
        this.headers = request.headers;
        request.headers.cookie = request.headers.cookie || '';
        this.cookie = qs.parse(request.headers.cookie.replace('; ', '&'));
        this.method = request.method;
        this.pathname = url.parse(request.url).pathname;
    };

    _req.prototype.handleForm = function () {
        let self = this;

        if (self.method === 'GET') {
            // fixme: 修复quertstring
            self.form = qs.parse(request.url);
            delete self.form['/'];
            self.toResponse();
        } else if (self.method === 'POST') {
            let form = new formidable();
            let _formOptions = global.configs.formOptions;
            form.type = self.headers['content-type'];
            Object.keys(_formOptions).map((key) => {
                form[key] = _formOptions[key];
            });
            form.parse(request, function (err, fields, files) {
                self.form = fields;
                // @todo: 未传文件则置空对象
                self.form.files = __formatFiles(files);
                self.toResponse();
            });
        }
    };

    _req.prototype.toResponse = function () {
        router.routeHandle(this, respone);
    };

    return new _req(request);
};
