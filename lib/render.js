/// <reference path='../typings/index.d.ts' />
const swig = require('swig');
const path = require('path');
const global = require('./global');

module.exports = function () {
    const debug = global.runTimeConfig.debug;
    const _prefix = global.configs.templatesPath;

    if (debug) swig.setDefaults({ cache: false });

    // todo: 添加统一的 url_for 函数
    swig.setFilter('static', function (input) {
        return './' + global.configs.static + '/' + input;
    });

    /**
     * 封装 swig 操作，返回渲染后的模板
     *
     * @param templatePath 模板路径
     * @param data 填充内容
     * @returns {string} 渲染后的模板
     */
    return function (templatePath, data) {
        let template;
        if (/\.html$/.test(templatePath)) {
            let realPath = path.join(_prefix, templatePath);
            template = swig.compileFile(realPath);
        } else {
            template = swig.compile(templatePath);
        }

        return template(data);
    };

};
