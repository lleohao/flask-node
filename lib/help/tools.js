/// <reference path='../../typings/index.d.ts' />
const util = require('util');
const colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

let STATIC_TYPE = {
    text: ['html', 'css', 'js', 'json'],
    image: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
    other: ['ico']
};

let mimes = {
    'css': 'text/css',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'xml': 'text/xml'
};

let _staticPattern = '(';
for (let key in STATIC_TYPE) {
    for (let i = 0, len = STATIC_TYPE[key].length; i < len; i++) {
        _staticPattern += '\\.' + STATIC_TYPE[key][i] + '|';
    }
}
_staticPattern = _staticPattern.substring(0, _staticPattern.length - 1);
_staticPattern += ')$';
let _re = new RegExp(_staticPattern, 'i');

module.exports = {
    setHeaders: function (headers, res) {
        for (let key in headers) {
            //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
            res.setHeader(key, headers[key]);
        }
    },
    getContentType: function (ext) {
        return mimes[ext] || 'text/plain';
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
    },
    colors: colors
};
