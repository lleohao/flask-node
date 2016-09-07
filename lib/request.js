/// <reference path='../typings/index.d.ts' />
const parse = require('parseurl'),
    util = require('util'),
    qs = require('querystring'),
    Response = require('./response'),
    configs = require('./utils/configs'),
    routerHandle = require('./router').handleRouter,
    formidable = require('formidable').IncomingForm;

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
            files[value].urlMap(function (value) {
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

module.exports = function (request, response) {
    const _req = function () {
        this._parser = parse(request);

        this.headers = request.headers;
        request.headers.cookie = request.headers.cookie || '';
        this.cookie = qs.parse(request.headers.cookie.replace('; ', '&'));
        this.method = request.method;
        this.pathname = this._parser.pathname;
    };

    _req.prototype.handleForm = function () {
        let self = this;

        if (this.method === 'GET') {
            if (this._parser.query) {
                this.form = qs.parse(this._parser.query);
            }
            this.toResponse();
        } else if (self.method === 'POST') {
            let form = new formidable();
            let formOptions = configs.FormOptions;
            form.type = self.headers['content-type'];
            Object.keys(formOptions).map((key) => {
                form[key] = formOptions[key];
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
        let res = new Response(response);
        routerHandle(this, res);
    };

    return new _req(request);
};
