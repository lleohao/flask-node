/// <reference path="../typings/index.d.ts" />
const path = require("path");
const qs = require("querystring");
const url = require("url");

module.exports = function (request, rootPath, config) {
    var _req = function (request) {
        this.header = request.headers;
        this.method = request.method;
        this.pathname = url.parse(request.url).pathname;

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

        this._formObj = qs.parse(request.url);
        this.form = this._formObj;
        delete this.form["/"];
        this.agrs = {
            get: function (name) {
                let _name = name.toLowerCase();
                if(this.header[_name]) {
                    return this.header[_name];
                } else if(this._formObj[_name]) {
                    return this._formObj[_name]
                } else {
                    throw new Error("The key: " + _name + " is not in request");
                }
            }
        }
    };

    return new _req(request);
}