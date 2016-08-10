/// <reference path="../typings/index.d.ts" />
const path = require("path");
const qs = require("querystring");
const url = require("url");
const router = require("./router");

const contentType = "Content-Type".toLowerCase();

module.exports = function (request, rootPath, config) {
    const _req = function (request) {
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

    _req.prototype.afterFormat = function (respone) {
        let self = this;
        this._response = respone;

        // 处理form表单内容
        if (this.method === 'GET') {
            this._formObj = qs.parse(request.url);
            this.form = this._formObj;
            // 删除无用的属性
            delete this.form["/"];
            self.toResponse();
        } else if (this.method === 'POST') {
            let _ctype = this.headers[contentType];
            if (_ctype === "application/x-www-form-urlencoded") {
                self._data = "";
                request.on("data", function (chunk) {
                    self._data += chunk;
                })
                request.on("end", function () {
                    self.form = qs.parse(self._data);
                    self.toResponse();
                })
            }
        }
    }

    _req.prototype.toResponse = function () {
        router.routeHandle(this, this._response);
    }

    return new _req(request);
}