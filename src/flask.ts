import { createServer } from 'http';

import { Request } from './request';
import { Response } from './response';
import { Sever } from './static';
import { handleRouter } from './router';
import { createRender, RenderFunction } from './render';
import { Configs, FlaskOptions, ServerRunningOptions } from './configs';

/**
 * Global config instance
 * @private
 */
export const configs = new Configs();

/**
 * Flask class
 */
export class Flask {
    /**
     * If staticRex can match request url
     *
     * the request will be treated as a static file request
     */
    private staticRex: RegExp;
    /**
     * Render function
     */
    private render: RenderFunction;

    /**
     * Create Flask instance
     * @param rootPath - app root path
     * @param options - Flask options
     */
    constructor(rootPath: string, options: FlaskOptions = {}) {
        configs.setConfigs(rootPath, options);

        this.staticRex = new RegExp(
            '^/' + configs.flaskOptions.staticUrlPath + '/'
        );
        this.render = createRender(configs);
    }

    /**
     * Create Flask server
     */
    private createServer() {
        let runTimeOptions = configs.ServerRunningOptions;
        let staticServer = new Sever();

        return createServer((request, response) => {
            response.setHeader('server', 'node/flask');

            if (request.method === 'OPTIONS') {
                response.end();
            } else {
                let req = new Request(request);

                if (this.staticRex.test(req.pathname)) {
                    staticServer.serve(req, response);
                } else {
                    handleRouter(req, new Response(response, this.render));
                }
            }

            if (runTimeOptions.debug)
                console.log(
                    `[${new Date()}] path: ${request.url} method: ${
                        request.method
                    }`
                );
        });
    }

    /**
     * Run Flask app
     * @param options
     */
    public run(options?: ServerRunningOptions) {
        options = options || {};
        configs.setRunTime(options);
        let runTimeOptions = configs.ServerRunningOptions;

        let server = this.createServer();

        server.listen(runTimeOptions.port, runTimeOptions.hostname);
        console.log(
            `Server is run on http://${runTimeOptions.hostname}:${
                runTimeOptions.port
            }`
        );
    }
}
