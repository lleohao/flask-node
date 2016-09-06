const path = require('path');
/**
 * 全局变量配置对象
 *
 */
const Global = {};

/**
 * 程序配置
 *
 * @type {{rootPath: undefined, staticPath: undefined, templatesPath: undefined, tmpDirPath: undefined, formOptions: undefined}}
 */
Global.configs = {
    static: '',
    rootPath: '',
    staticPath: '',
    templatesPath: '',
    tmpDirPath: '',
    formOptions: ''
};

/**
 * 运行时配置
 *
 * @type {{port: number, hostname: string, debug: boolean}}
 */
Global.runTimeConfig = {
    port: 5050,
    hostname: 'localhost',
    debug: false,
};

/**
 * 默认配置
 *
 * @type {{rootPath: undefined, static: string, templates: string, tmpDir: string, formOptions: {autoSave: boolean, encoding: string, uploadDir: string, keepExtensions: boolean, maxFieldsSize: number, maxFields: number, hash: boolean, multiples: boolean}}}
 */
Global.deafulatConfig = {
    rootPath: undefined,
    static: 'static',
    templates: 'templates',
    tmpDir: 'tmp',
    formOptions: {
        autoSave: false,
        encoding: 'utf-8',
        keepExtensions: false,
        maxFieldsSize: 2 * 1024 * 1024,
        maxFields: 1000,
        hash: false,
        multiples: true
    }
};

/**
 * 内部变量：全局缓存时间设置
 *
 */
Global.$Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 86400
};

Global.$Other = {
};

/**
 * 设置 config
 *
 * @param configs
 */
Global.setConfigs = function (configs) {
    let _configs = Object.assign(this.deafulatConfig, configs);

    this.$Other.staticRegex = new RegExp('^/' + _configs.static + '/', 'i');
    this.configs.static = _configs.static;
    this.configs.staticPath = path.join(this.configs.rootPath, _configs.static);
    this.configs.templatesPath = path.join(this.configs.rootPath, _configs.templates);
    this.configs.tmpDirPath = path.join(this.configs.rootPath, _configs.tmpDir);
    this.configs.formOptions = _configs.formOptions;
    // 自动保存若为true, 则将目录设置为配置项中的 uploadDir
    // 否则则设置到 tmp 文件夹中
    if (this.configs.formOptions.autoSave) {
        if (configs.formOptions.uploadDir === undefined) {
            throw TypeError('formOptions.uploadDir is undefined, it must be a string');
        }
        configs.formOptions.uploadDir = path.join(this.configs.rootPath, configs.formOptions.uploadDir);
    } else {
        this.configs.formOptions.uploadDir = this.configs.tmpDirPath;
    }
};

module.exports = Global;