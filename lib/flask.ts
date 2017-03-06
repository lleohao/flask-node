import { createServer } from 'http';

import { Request } from './request';
import { Sever } from './static';
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

        return createServer((request, res) => {
            res.setHeader('server', 'node/flask');


            if (request.method === 'OPTIONS') {
                // TODO: 优化options请求
            } else {
                let req = new Request(request);

                if (this.staticRex.test(req.pathname)) {
                    staticServer.serve(req, res);
                } else {
                    req.parse(() => {

                    })
                }
            }

            if (runTimeOptions.debug)
                console.log(`[${new Date()}] path: ${request.url} method: ${request.method}`);
        });
    }

    run(options: RunTimeOptions = {}) {
        configs.setRunTime(options);
        let runTimeOptions = configs.runTimeOptions;

        let server = this.createServer();

        server.listen(runTimeOptions.port, runTimeOptions.hostname);
        console.log(`Server is run on http://${runTimeOptions.hostname}:${runTimeOptions.port}`);
    }
}

let app = new Flask(__dirname);
app.run();