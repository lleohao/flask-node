/// <reference path="../typings/index.d.ts" />
const fs = require("fs");
const path = require("path");
const tools = require("./help/tools");

let staticServer = function (datagram, response) {
    let pathname = datagram.pathname;
    let headers = datagram.headers;
    let realPath = path.join(__dirname, global.filePath.static, pathname);

    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            let ext = path.extname(pathname).slice(1) || 'unknow';
            let contentType = tools.getContentType(ext);

            fs.stat(realPath, (err, stat) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': "text/plain" });
                    response.end(err);
                } else {
                    let lastModify = stat.mtime.toUTCString();
                    let ifModifiedSince = "If-Modified-Since".toLowerCase();
                    response.setHeader("Last-Modified", lastModify);

                    // 设置 Cache-Control Expires
                    if (Expires.fileMatch.test(ext)) {
                        let expires = new Date();
                        expires.setTime(expires.getTime() + Expires.maxAge);
                        response.setHeader("Expires", expires.toUTCString());
                        response.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
                    }

                    if (headers[ifModifiedSince] && lastModify == headers[ifModifiedSince]) {
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        response.writeHead(200, { "Content-Type": contentType });
                        var rs = fs.createReadStream(realPath, {
                            encoding: "binary"
                        });
                        rs.on("data", (chunck) => {
                            rs.pause()
                            response.write(chunck, "binary", () => {
                                rs.resume();
                            });
                        })
                        rs.on("end", () => {
                            response.end();
                        })
                    }
                }
            })
        }
    })
}

module.exports = staticServer;