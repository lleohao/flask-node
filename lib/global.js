/**
 * 全局变量配置对象
 * 
 */
const Global = {};

/**
 * 程序配置信息
 * 
 */
Global.Options = {
    staticPath: 'static',
    templatesPath: 'templates',
    tmpDir: 'tmp',
    formOption: {
        autoSave: false,
        encoding: 'utf-8',
        uploadDir: this.tmpDir,
        keepExtensions: false,
        maxFieldsSize: 2 * 1024 * 1024,
        maxFields: 1000,
        hash: false,
        multiples: true
    }
};

/**
 * 程序运行配置信息
 * 
 */
Global.RuntimeConfig = {

};


/**
 * 内部变量：全局缓存时间设置
 * 
 */
Global.$Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 86400
};

/**
 * 内部变量：静态服务器配置信息
 * 
 */
Global.$StaticServer = {

};


module.exports = Global;