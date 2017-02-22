import { normalize, join } from 'path';

export interface FlaskOptions {
    staticFolder?: string;
    templateFolder?: string;
}

export interface FlaskRuntimeOptions {
    debug?: boolean;
    port?: number;
    hostname?: string;
}

export class Configs {
    flaskOptions: {
        rootPath: string
        staticPath: string
        templatesPath: string
    };
    staticServerOptions: {
        cacheTime: number
    };
    formOptions: {
        autoSave: boolean
        uploadPath: string
    };
    runTimeOptions: {
        debug: boolean
        port: number
        hostname: string
    };

    constructor() {
        this.flaskOptions = {
            rootPath: '',
            staticPath: '',
            templatesPath: ''
        };
        this.staticServerOptions = {
            cacheTime: 60 * 60
        };
        this.formOptions = {
            autoSave: false,
            uploadPath: undefined
        };
        this.runTimeOptions = {
            debug: false,
            port: 5050,
            hostname: 'localhost'
        }
    }

    setConfigs(rootPath, options: FlaskOptions) {
        options = Object.assign({
            staticFolder: 'static',
            templateFolder: 'template'
        }, options);

        let flaskOptions = this.flaskOptions;
        flaskOptions.rootPath = rootPath;
        flaskOptions.staticPath = join(rootPath, normalize(options.staticFolder));
        flaskOptions.templatesPath = join(rootPath, normalize(options.templateFolder));
    };

    setRunTime(options) {
        let defaultOptions = {
            port: 5050,
            hostname: '127.0.0.1',
            debug: false
        };

        this.runTimeOptions = Object.assign(defaultOptions, options);
    };
};