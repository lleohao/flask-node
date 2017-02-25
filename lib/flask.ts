import { createServer } from 'http';
import { Configs, FlaskOptions, FlaskRuntimeOptions } from './configs';

export const configs = new Configs();

export class Flask {
    constructor(rootPath: string, options: FlaskOptions = {}) {
        configs.setConfigs(rootPath, options);
    }

    private createServer() {
        let runTimeOptions = configs.runTimeOptions;

        return createServer((req, res) => {
            res.setHeader('server', 'node/flask');
            if (runTimeOptions.debug)
                console.log(`[${new Date()}] path: ${req.url} method: ${req.method}`);

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end()
            }


            res.end('ok');
        });
    }

    run(options: FlaskRuntimeOptions = {}) {
        configs.setRunTime(options);
        let runTimeOptions = configs.runTimeOptions;

        let server = this.createServer();

        server.listen(runTimeOptions.port, runTimeOptions.hostname);
        console.log(`Server is run on http://${runTimeOptions.hostname}:${runTimeOptions.port}`);
    }
}

let app = new Flask(__dirname);
app.run({debug: true});