/// <reference path='../typings/index.d.ts' />
const swig = require('swig');
const path = require('path');

// TODO: 更好的解决方式
let debug = false;
if (process.env.NODE_ENV === 'development') debug = true;

/*eslint-disable no-unused-vars */
// TODO: 暂时传入 options, 方便以后调用
module.exports = function (config, options) {
    if (debug) swig.setDefaults({cache: false});

    swig.setFilter('static', function (input) {
        return './' + input;
    });

    let render_template = function () {
        let _prefix = config.templates;
        return function (templatePath, data) {
            let realPath = path.join(_prefix, templatePath);
            let template = swig.compileFile(realPath);
            return template(data);
        };
    };

    return render_template();
};