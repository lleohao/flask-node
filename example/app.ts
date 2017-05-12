import { join } from 'path';
import { Flask, Router, Request, Response } from '../lib';

const app = new Flask(join(__dirname, '..', 'example'));
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
        res.render('upload-main.html');
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
        if (req.form('username') === user.username
            && req.form('password') === user.password) {
            isLogin = true;
            res.redirect('/');
        } else {
            res.render('login-main.html', {
                message: '账户或密码错误'
            });
        }
    }
};

router.add('/', ['get'], indexHandle);
router.add('/upload', ['get'], uploadHandle);
router.add('/login', ['get', 'post'], loginHandle);

app.run({ debug: true });