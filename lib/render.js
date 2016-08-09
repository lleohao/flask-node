/// <reference path="../typings/index.d.ts" />
/**
 * swig 模版类
 */
const swig = require("swig");
const path = require("path");

swig.setFilter("static", function(input) {
    return "./" + input;
})

let render_template = function (rootPath, config) {
    let _prefix = path.join(rootPath, config.templates);
    return function (templatePath, data) {
        let realyPath = path.join(_prefix, templatePath);
        let template = swig.compileFile(realyPath);
        return template(data);
    }
};

module.exports = render_template;