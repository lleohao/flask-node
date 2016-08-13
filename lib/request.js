/// <reference path="../typings/index.d.ts" />
const path = require("path");
const url = require("url");
const qs = require("querystring");
const router = require("./router");
const formidable = require('formidable').IncomingForm;
const util = require('util');
const tools = require("./help/tools");

const contentType = "Content-Type".toLowerCase();

module.exports = function (request, respone, config) {
    const _req = function () {
        // 设置静态属性
        this.headers = request.headers;
        this.method = request.method;
        this.pathname = url.parse(request.url).pathname;

        // 设置cookie
        this._cookieObj = {};
        this.headers.cookie = this.headers.cookie || "";
        this.headers.cookie.split("; ").forEach((val) => {
            let _tmp = val.split("=");
            this._cookieObj[_tmp[0]] = _tmp[1];
        })
        this.cookie = {
            get: function (name) {
                return _cookieObj[name];
            },
            cookieObj: this._cookieObj
        }

        // 获取所有参数方法，带有错误提示
        this.agrs = {
            get: function (name) {
                let _name = name.toLowerCase();
                if (this.headers[_name]) {
                    return this.headers[_name];
                } else if (this._formObj[_name]) {
                    return this._formObj[_name]
                } else {
                    throw new Error("The key: " + _name + " is not in request");
                }
            }
        }
    };

    _req.prototype.afterFormat = function () {
        let self = this;

        // 处理form表单内容
        if (self.method === 'GET') {
            self._formObj = qs.parse(request.url);
            self.form = this._formObj;
            // 删除无用的属性
            delete self.form["/"];
            self.toResponse();
        } else if (self.method === 'POST') {
            // 初始化 form 对象
            let form = new formidable();
            form.type = self.headers.contentType
            for (var key in config.form) {
                if (form.hasOwnProperty(key)) {
                    form[key] = config.form[key];
                }

            }
            if (!config.form['autoSave']) {  // 自动保存为false，则将文件存放到tmp文件夹下
                form.uploadDir = config.tmpDir;
            }


            form.parse(request, function (err, fields, files) {
                self.form = fields;
                self.form.files = tools.formatFiles(files);
                console.log(self);
                self.toResponse();
            })
        }
    }

    _req.prototype.toResponse = function () {
        router.routeHandle(this, respone);
    }

    return new _req(request);
}