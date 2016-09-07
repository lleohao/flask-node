const path = require('path');
const colors = require('colors');
const configs = require('./configs');



colors.setTheme(colorsTheme);

module.exports.colors = colors;
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