import { createServer } from 'http';

import { Request } from './request';
import { Sever } from './static';
import { Configs, FlaskOptions, RunTimeOptions } from './configs';

export const configs = new Configs();

export class Flask {
    staticUrl: string;

    constructor(rootPath: string, options: FlaskOptions = {}) {
        configs.setConfigs(rootPath, options);

        this.staticUrl = '/' + configs.flaskOptions.staticUrlPath + '/'
    }

    private createServer() {
        let runTimeOptions = configs.runTimeOptions;
        let staticServer = new Sever()

        return createServer((request, res) => {
            let req = new Request(request);

            res.setHeader('server', 'node/flask');

            if (request.method === 'OPTIONS') {
                res.writeHead(200);
                res.end()
            }

            if (req.pathname.indexOf(this.staticUrl) === 0) {
                staticServer.serve(req, res);
            } else {
                res.end(JSON.stringify(req.cookies('serviceName')));
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