import { join } from 'path';
import { Flask, Router, Request, Response } from '../../lib';

const app = new Flask(join(__dirname, '..', 'loginDemo'));
const router = new Router();

const indexHandle = (req: Request, res: Response) => {
    res.render('index.html');
};

router.add('/', ['get'], indexHandle);

app.run({ debug: true });