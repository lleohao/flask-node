/// <reference path="../../typings/index.d.ts" />
const util = require("util");
let STATIC_TYPE = {
    text: ['html', 'css', 'js', 'json'],
    image: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
    other: ['ico']
};

let mimes = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}

let _staticPattern = "(";
for (key in STATIC_TYPE) {
    for (let i = 0, len = STATIC_TYPE[key].length; i < len; i++) {
        _staticPattern += "\\." + STATIC_TYPE[key][i] + "|";
    }
}
_staticPattern = _staticPattern.substring(0, _staticPattern.length - 1);
_staticPattern += ")$";
let _re = RegExp(_staticPattern, "i");

module.exports = {
    setHeaders: function (headers, res) {
        for (let key in headers) {
            res.setHeader(key, headers[key])
        }
    },
    getContentType: function (ext) {
        return mimes[ext] || "text/plain"
    },
    staticMatch: _re,
    formatFiles: function (files) {
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
                    }
                })
            } else {
                _files[value] = {
                    domain: files[value].domain,
                    size: files[value].size,
                    path: files[value].path,
                    name: files[value].name,
                    type: files[value].type,
                    lastModifiedDate: files[value].lastModifiedDate
                }
            }
        })
        return _files;
    }
};

/*
 { icon: 
   File {
     domain: null,
     size: 7064714,
     path: 'D:\\users\\Desktop\\flask-node\\tests\\form-test\\tmp\\upload_11fd1c3734e5c7be67bc4dbc676f734e',
     name: 'DSCF3478-1.jpg',
     type: 'image/jpeg',
     hash: null,
     lastModifiedDate: 2016-08-13T01:20:36.575Z
     }
    }
       _events: {},
       _eventsCount: 0,
       _maxListeners: undefined,
       size: 7064714,
       path: 'D:\\users\\Desktop\\flask-node\\tests\\form-test\\tmp\\upload_55705e393fa99569ba4fda31a5ab91fc',
       name: 'DSCF3478-1.jpg',
       type: 'image/jpeg',
       hash: null,
       lastModifiedDate: 2016-08-13T01:25:35.112Z,
       _writeStream: [Object] },
     File {
       domain: null,
       _events: {},
       _eventsCount: 0,
       _maxListeners: undefined,
       size: 5689100,
       path: 'D:\\users\\Desktop\\flask-node\\tests\\form-test\\tmp\\upload_9b77bc9247215d022c342c756b1eec97',
       name: 'DSCF3496-2.jpg',
       type: 'image/jpeg',
       hash: null,
       lastModifiedDate: 2016-08-13T01:25:35.164Z,
       _writeStream: [Object] } ] }
*/