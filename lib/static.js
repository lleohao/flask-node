/// <reference path="../typings/index.d.ts" />
const fs = require("fs");
const path = require("path");
const tools = require("./help/tools");
const global = require("./global");

let debug = false;
if (process.env.NODE_ENV === "development") debug = true;
/**
 * 处理静态文件
 */
module.exports = function (config) {
    let staticServer = function (req, response) {
        let pathname = req.pathname;
        let realPath = path.join(config.static ,pathname);

        if(debug) console.log("[static.js 16] StaticServer: " + realPath);
        fs.exists(realPath, function (exists) {
            if (!exists) {
                // 文件不存在
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                // 获取contentType
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
                        if (global.Expires.fileMatch.test(ext)) {
                            let expires = new Date();
                            expires.setTime(expires.getTime() + global.Expires.maxAge);
                            response.setHeader("Expires", expires.toUTCString());
                            response.setHeader("Cache-Control", "max-age=" + global.Expires.maxAge);
                        }

                        if (req.headers[ifModifiedSince] && lastModify == req.headers[ifModifiedSince] && !debug) {
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
    return staticServer;
}