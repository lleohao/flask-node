/// <reference path="../typings/index.d.ts" />
let debug = false;
if (process.env.NODE_ENV === "development") debug = true;

const swig = require("swig");
const path = require("path");

swig.setFilter("static", function(input) {
    return "./" + input;
});
if(debug) swig.setDefaults({cache: false});

let render_template = function (rootPath, config, debug) {
    let _prefix = path.join(rootPath, config.templates);
    return function (templatePath, data) {
        let realyPath = path.join(_prefix, templatePath);
        let template = swig.compileFile(realyPath);
        return template(data);
    }
};

module.exports = render_template;