import { createServer } from 'http';

import { Request } from './request';
import { Response } from './response';
import { Sever } from './static';
import { handleRouter } from './router';
import { Configs, FlaskOptions, RunTimeOptions } from './configs';

export const configs = new Configs();

export class Flask {
    staticRex: RegExp;

    constructor(rootPath: string, options: FlaskOptions = {}) {
        configs.setConfigs(rootPath, options);

        this.staticRex = new RegExp('^\/' + configs.flaskOptions.staticUrlPath + '\/');
    }

    private createServer() {
        let runTimeOptions = configs.runTimeOptions;
        let staticServer = new Sever()

        return createServer((request, response) => {
            response.setHeader('server', 'node/flask');

            if (request.method === 'OPTIONS') {
                // TODO: 优化options请求
                response.end();
            } else {
                let req = new Request(request);

                if (this.staticRex.test(req.pathname)) {
                    staticServer.serve(req, response);
                } else {
                    handleRouter(req, new Response(response));
                }
            }

            if (runTimeOptions.debug)
                console.log(`[${new Date()}] path: ${request.url} method: ${request.method}`);
        });
    }

    run(options?: RunTimeOptions) {
        options = options || {};
        configs.setRunTime(options);
        let runTimeOptions = configs.runTimeOptions;

        let server = this.createServer();

        server.listen(runTimeOptions.port, runTimeOptions.hostname);
        console.log(`Server is run on http://${runTimeOptions.hostname}:${runTimeOptions.port}`);
    }
}
