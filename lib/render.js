/// <reference path='../typings/index.d.ts' />
const swig = require('swig');
const path = require('path');
const global = require('./global');

const debug = global.runTimeConfig.debug;
const _prefix = global.configs.templatesPath;

if (debug) swig.setDefaults({cache: false});

// todo: 和staticServer一同修复这个函数
// todo: 添加统一的 url_for 函数
swig.setFilter('static', function (input) {
    return './' + input;
});

/**
 * 封装 swig 操作，返回渲染后的模板
 *
 * @param templatePath 模板路径
 * @param data 填充内容
 * @returns {string} 渲染后的模板
 */
module.exports = function (templatePath, data) {
    let realPath = path.join(_prefix, templatePath);
    let template = swig.compileFile(realPath);
    return template(data);
};