/// <reference path="../typings/index.d.ts" />
const path = require("path");
const qs = require("querystring");
const url = require("url");

const contentType = "Content-Type".toLowerCase();

module.exports = function (request, rootPath, config) {
    var _req = function (request) {
        // 设置静态属性
        this.headers = request.headers;
        this.method = request.method;
        this.pathname = url.parse(request.url).pathname;

        // 设置cookie
        this._cookieObj = {};
        this.header.cookie.split("; ").forEach((val) => {
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

        // 设置form
        if (this.method === 'GET') {
            this._formObj = qs.parse(request.url);
            this.form = this._formObj;
            // 删除无用的属性
            delete this.form["/"];
        } else if (this.method === 'POST') {
            let _ctype = this.headers[contentType];
            if(_ctype === "application/x-www-form-urlencoded") {
                this.data = "";
                request.on("data", function(chunk) {
                    this.data += chunk;
                })
                request.on("end", function() {
                    this.form = qs.parse(this.data);
                })
            }
        }   
    };

    return new _req(request);
}