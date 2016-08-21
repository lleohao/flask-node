/**
 * Created by hzzhouhao1 on 2016/8/21.
 */
require('should');
const global = require('../lib/global');
const rootPath = __dirname;

global.configs.rootPath = rootPath;
global.setConfigs({});

describe('global.js test', function () {
    describe('不传入设置项', function () {
        it('返回默认配置信息', function () {
            global.configs.should.be.an.object;
            global.configs.staticPath.should.be.equal('E:\\nodeServer\\test\\static');
        })
    });

    describe('传入设置项', function () {
        it('返回配置信息', function () {
            global.setConfigs({
                static: 'asset',
                tmpDir: 'temp',
                formOptions: {
                    encoding: 'gbk',
                    autoSave: true,
                    uploadDir: 'data'
                }
            });
            global.configs.should.be.an.object;
            global.configs.staticPath.should.be.equal('E:\\nodeServer\\test\\asset');
            global.configs.tmpDirPath.should.be.equal('E:\\nodeServer\\test\\temp');
            global.configs.formOptions.encoding.should.be.equal('gbk');
            global.configs.formOptions.uploadDir.should.be.equal('E:\\nodeServer\\test\\data');
        })
    });
});




