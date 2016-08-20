/**
 * 
 * 全局变量配置对象
 */
const Global = {};

Global.Options = {

};

Global.RuntimeConfig = {

};

Global.Expires = {

};

Global.StaticServer = {

};


module.exports = {
    Expires: {
        fileMatch: /^(gif|png|jpg|js|css)$/ig,
        maxAge: 86400
    },
    filePath: {
        static: 'static',
        templates: 'templates',
        tmpDir: 'tmp',
        form: {
            autoSave: false,
            encoding: 'utf-8',
            uploadDir: this.tmpDir,
            keepExtensions: false,
            maxFieldsSize : 2 * 1024 * 1024,
            maxFields: 1000,
            hash: false,
            multiples: true
        }
    }
};