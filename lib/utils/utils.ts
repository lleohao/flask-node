import { normalize, join } from 'path';
import { configs } from './configs';

const _setFlaskConfig = function (_configs) {
    let defaultConfig = {
            static: 'static',
            templates: 'templates',
            temp: 'temp'
        },
        root = configs.Flask.root;

    defaultConfig = Object.assign(defaultConfig, _configs);

    configs.Flask.static = normalize(defaultConfig.static);
    configs.Flask.staticPath = join(root, normalize(defaultConfig.static));
    configs.Flask.templates = join(root, normalize(defaultConfig.templates));
    configs.Flask.temp = join(root, normalize(defaultConfig.temp));
};

const _setStaticServer = function (_configs) {
    let defaultConfig = {
        cache: 3600,
        fileMatch: null,
    };

    configs.StaticServer = Object.assign(defaultConfig, _configs);
};

const _setFormOptions = function (_configs) {
    let defaultConfig = {
        autoSave: false,
        encoding: 'utf-8',
        keepExtensions: false,
        maxFieldsSize: 2097152,
        maxFields: 1000,
        hash: false,
        multiples: true
    };

    configs.FormOptions = Object.assign(defaultConfig, _configs);

    // 自动保存若为true, 则将目录设置为配置项中的 uploadDir
    // 否则则设置到 tmp 文件夹中
    if (configs.FormOptions.autoSave) {
        if (configs.FormOptions.uploadDir === undefined) {
            throw TypeError('formOptions.uploadDir is undefined, it must be a string');
        }
        configs.FormOptions.uploadDir = join(configs.Flask.root, normalize(configs.FormOptions.uploadDir));
    } else {
        configs.FormOptions.uploadDir = configs.Flask.temp;
    }
};

export const setConfigs = function (_configs) {
    _setFlaskConfig(_configs);

    if (_configs.StaticServer) _setStaticServer(_configs.StaticServer);
    if (_configs.FormOptions) _setFormOptions(_configs.FormOptions);
};

export const setRunTime = function (options) {
    let defaultConfig = {
        port: 5050,
        hostname: '127.0.0.1',
        debug: false
    };

    configs.RunTime = Object.assign(defaultConfig, options);
};