import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { Flask, Router, Request, Response } from '../lib';

const rootPath = join(__dirname, '..', 'example');

const app = new Flask(rootPath);
const router = new Router();

let isLogin = false;

const indexHandle = (req: Request, res: Response) => {
    if (isLogin === false) {
        res.redirect('/login');
    } else {
        res.render('index.html');
    }
};

const uploadHandle = (req: Request, res: Response) => {
    if (isLogin === false) {
        res.redirect('/login');
    } else {
        if (req.method === 'get') {
            res.render('upload-main.html');
        } else {
            let file = req.files('uploadFile');
            let ws = createWriteStream(
                join(rootPath, 'static/upload', 'upload.jpg')
            );

            createReadStream(file.path)
                .pipe(ws)
                .on('close', () => {
                    res.end(
                        {
                            entiry: JSON.stringify({
                                data: { code: 200, filename: 'upload.jpg' }
                            }),
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        },
                        200
                    );
                });
        }
    }
};

const loginHandle = (req: Request, res: Response) => {
    const user = {
        username: 'admin@admin.com',
        password: 'root'
    };

    if (req.method === 'get') {
        res.render('login-main.html');
    } else {
        if (
            req.form('username') === user.username &&
            req.form('password') === user.password
        ) {
            isLogin = true;
            res.redirect('/upload');
        } else {
            res.render('login-main.html', {
                message: 'Account or password error.'
            });
        }
    }
};

router.add('/', ['get'], indexHandle);
router.add('/upload', ['get', 'post'], uploadHandle);
router.add('/login', ['get', 'post'], loginHandle);

app.run({ debug: true });
