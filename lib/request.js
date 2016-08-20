/// <reference path='../typings/index.d.ts' />
const url = require('url');
const qs = require('querystring');
const tools = require('./help/tools');
const router = require('./router');
const formidable = require('formidable').IncomingForm;

const contentType = 'Content-Type'.toLowerCase();

module.exports = function (request, respone, config) {
    const _req = function () {
        this.headers = request.headers;
        request.headers.cookie = request.headers.cookie || '';
        this.cookie = qs.parse(request.headers.cookie.replace('; ', '&'));
        this.method = request.method;
        this.pathname = url.parse(request.url).pathname;
    };

    _req.prototype.afterHandleForm = function () {
        let self = this;

        if (self.method === 'GET') {
            self.form = qs.parse(request.url);
            delete self.form['/'];
            self.toResponse();
        } else if (self.method === 'POST') {
            let form = new formidable();
            form.type = self.headers[contentType];
            for (let key in config.form) {
                //noinspection JSUnfilteredForInLoop
                if (form.hasOwnProperty(key)) {
                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                    form[key] = config.form[key];
                }
            }
            form.parse(request, function (err, fields, files) {
                self.form = fields;
                // @todo: 未传文件则置空对象
                self.form.files = tools.formatFiles(files);
                self.toResponse();
            });
        }
    };

    _req.prototype.toResponse = function () {
        router.routeHandle(this, respone);
    };

    return new _req(request);
};
