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
        for(let key in headers) {
            res.setHeader(key, headers[key])
        }
    },
    getContentType: function(ext) {
        return mimes[ext] || "text/plain"
    },
    staticMatch: _re
};