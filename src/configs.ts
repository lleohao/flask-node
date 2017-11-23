import { join, resolve, normalize } from 'path';

/**
 * Flask app options
 */
export interface FlaskOptions {
    /**
     * static file folder
     */
    staticFolder?: string;
    /**
     * static path
     */
    staticUrlPath?: string;
    /**
     * template file folder
     */
    templateFolder?: string;
    /**
     * Static server options
     */
    staticOptions?: StaticServerOptions;
}

/**
 * Static server options
 */
export interface StaticServerOptions {
    /**
     * whether open cahce.
     *
     * if debug is true, this cahce is useless.
     */
    cache?: number | boolean;
    /**
     * whether open gizp
     */
    gzip?: boolean | RegExp;
}

/**
 * Server running options
 */
export interface ServerRunningOptions {
    /**
     * whether open debug mode
     */
    debug?: boolean;
    /**
     * server port
     */
    port?: number;
    /**
     * server hostname
     */
    hostname?: string;
}

/**
 * HTTP header k-v object
 */
export interface HeaderValue {
    [key: string]: string;
}

/**
 * Global Configs Class
 * @private
 */
export class Configs {
    /**
     * Flask options
     */
    flaskOptions: {
        rootPath: string;
        templatesPath: string;
        staticRootPath: string;
        staticUrlPath: string;
    };
    /**
     * Statuc server options
     */
    staticServerOptions: {
        gzip: boolean | RegExp;
        cache: number | boolean;
        headers: HeaderValue;
    };
    /**
     * Server running options
     */
    ServerRunningOptions: {
        debug: boolean;
        port: number;
        hostname: string;
    };

    constructor() {
        this.flaskOptions = {
            rootPath: '',
            staticUrlPath: '',
            staticRootPath: '',
            templatesPath: ''
        };
        this.staticServerOptions = {
            cache: 3600,
            gzip: true,
            headers: {}
        };
        this.ServerRunningOptions = {
            debug: false,
            port: 5050,
            hostname: 'localhost'
        };
    }

    setConfigs(rootPath: string, options: FlaskOptions) {
        let staticFolder = options.staticFolder || 'static';
        let staticUrlPath = options.staticUrlPath || 'static';
        let templateFolder = options.templateFolder || 'templates';

        if (normalize(staticUrlPath).indexOf('.') !== -1) {
            throw new RangeError(`static url path is over root path`);
        }

        let flaskOptions = this.flaskOptions;
        flaskOptions.rootPath = rootPath;
        flaskOptions.staticUrlPath = normalize(staticUrlPath).replace(
            '\\',
            '/'
        );
        flaskOptions.templatesPath = resolve(join(rootPath, templateFolder));
        flaskOptions.staticRootPath = resolve(join(rootPath, staticFolder));

        if (options.staticOptions) {
            this.staticServerOptions = Object.assign(
                this.staticServerOptions,
                options.staticOptions
            );
        }
    }

    setRunTime(options?: ServerRunningOptions) {
        if (options) {
            this.ServerRunningOptions = Object.assign(
                this.ServerRunningOptions,
                options
            );
        }
    }
}
