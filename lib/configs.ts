import { normalize, join } from 'path';

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
        staticPath: string
        templatesPath: string
    };
    staticServerOptions: {
        rootPath: string
        gzip: boolean | RegExp
        cache: number | boolean
    };
    runTimeOptions: RunTimeOptions;

    constructor() {
        this.flaskOptions = {
            rootPath: '',
            staticPath: '',
            templatesPath: ''
        };
        this.staticServerOptions = {
            cache: 3600,
            gzip: true,
            rootPath: ''
        };
        this.runTimeOptions = {
            debug: false,
            port: 5050,
            hostname: 'localhost'
        }
    }

    setConfigs(rootPath, options: FlaskOptions) {
        let {staticFolder, templateFolder} = Object.assign({
            staticFolder: options.staticFolder,
            templateFolder: options.templateFolder
        }, {
            staticFolder: 'static',
            templateFolder: 'templates'
        });

        let flaskOptions = this.flaskOptions;
        flaskOptions.rootPath = rootPath;
        flaskOptions.staticPath = join(rootPath, normalize(staticFolder));
        flaskOptions.templatesPath = join(rootPath, normalize(templateFolder));

        this.staticServerOptions.rootPath = flaskOptions.staticPath;

        if (options.staticOptions) {
            this.staticServerOptions = Object.assign(this.staticServerOptions, options.staticOptions)
        }
    };

    setRunTime(options) {
        this.runTimeOptions = Object.assign(this.runTimeOptions, options);
    };
};