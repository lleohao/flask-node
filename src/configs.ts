import { join, resolve, normalize } from 'path';

/**
 * Flask app options
 * 
 * @export
 * @interface FlaskOptions
 */
export interface FlaskOptions {
    /**
     * static file folder
     * 
     * @type {string}
     * @memberOf FlaskOptions
     */
    staticFolder?: string
    /**
     * static path
     * 
     * @type {string}
     * @memberOf FlaskOptions
     */
    staticUrlPath?: string
    /**
     * template file folder
     * 
     * @type {string}
     * @memberOf FlaskOptions
     */
    templateFolder?: string
    /**
     * Static server options
     * 
     * @type {StaticServerOptions}
     * @memberOf FlaskOptions
     */
    staticOptions?: StaticServerOptions
}

/**
 * 
 * 
 * @export
 * @interface StaticServerOptions
 */
export interface StaticServerOptions {
    /**
     * whether open cahce
     * if debug is true, this cahce is useless
     * 
     * @type {(number | boolean)}
     * @memberOf StaticServerOptions
     */
    cache?: number | boolean
    /**
     * whether open gizp
     * 
     * @type {(boolean | RegExp)}
     * @memberOf StaticServerOptions
     */
    gzip?: boolean | RegExp
}

/**
 * run time options 
 * 
 * @export
 * @interface RunTimeOptions
 */
export interface RunTimeOptions {
    /**
      * whether open debug mode
      * 
      * @type {boolean}
      * @default false
      * @memberOf FlaskRuntimeOptions
      */
    debug?: boolean
    /**
     * server port 
     * 
     * @type {number}
     * @default 5050
     * @memberOf FlaskRuntimeOptions
     */
    port?: number
    /**
     * server hostname
     * 
     * @type {string}
     * @default localhost
     * @memberOf FlaskRuntimeOptions
     */
    hostname?: string
}

export class Configs {
    flaskOptions: {
        rootPath: string
        templatesPath: string
        staticRootPath: string
        staticUrlPath: string
    };
    staticServerOptions: {
        gzip: boolean | RegExp
        cache: number | boolean
        headers: Object
    };
    runTimeOptions: RunTimeOptions;

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
        this.runTimeOptions = {
            debug: false,
            port: 5050,
            hostname: 'localhost'
        }
    }

    setConfigs(rootPath, options: FlaskOptions) {
        let staticFolder = options.staticFolder || 'static';
        let staticUrlPath = options.staticUrlPath || 'static';
        let templateFolder = options.templateFolder || 'templates';

        if (normalize(staticUrlPath).indexOf('.') !== -1) {
            throw new RangeError(`static url path is over root path`);
        }

        let flaskOptions = this.flaskOptions;
        flaskOptions.rootPath = rootPath;
        flaskOptions.staticUrlPath = normalize(staticUrlPath).replace('\\', '/');
        flaskOptions.templatesPath = resolve(join(rootPath, templateFolder));
        flaskOptions.staticRootPath = resolve(join(rootPath, staticFolder));

        if (options.staticOptions) {
            this.staticServerOptions = Object.assign(this.staticServerOptions, options.staticOptions)
        }
    };

    setRunTime(options) {
        this.runTimeOptions = Object.assign(this.runTimeOptions, options);
    };
};