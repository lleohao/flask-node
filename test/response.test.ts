import { createServer, get, request } from 'http';
import * as should from 'should';
import { Response } from '../lib/response';
import { createRender } from '../lib/render';
import { Configs } from '../lib/configs';

const configs = new Configs();
const render = createRender(configs);

describe('Response test', function () {
    it('setCookie test', (done) => {
        let server = createServer((req, res) => {
            const response = new Response(res, render);

            response.setCookie({
                key: 'test',
                value: 'test'
            });
            response.end('ok');
        });
        server.listen(5050);

        get({
            port: 5050
        }, (res) => {
            should(res.headers['set-cookie']).be.eql(['test=test; '])
            done();
            server.close();
        })
    })

    it('abort test', (done) => {
        let server = createServer((req, res) => {
            const response = new Response(res, render);

            response.abort();
        });
        server.listen(5050);

        get({
            port: 5050
        }, (res) => {
            should(res.statusCode).be.eql(401)
            done();
            server.close();
        })
    });

    it('abort test', (done) => {
        let server = createServer((req, res) => {
            const response = new Response(res, render);

            response.redirect('/main');
        });
        server.listen(5050);

        get({
            port: 5050
        }, (res) => {
            should(res.headers['location']).be.eql('/main')
            done();
            server.close();
        })
    });

    it('templatePath test', (done) => {
        let server = createServer((req, res) => {
            const response = new Response(res, render);

            response.render('<h1>hello {{ name }}</h1>', { name: 'lleohao' });
        });
        server.listen(5050);

        get({
            port: 5050
        }, (res) => {
            const data = [];

            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                should(data.toString()).be.eql('<h1>hello lleohao</h1>')
                done();
                server.close();
            })
        })
    });
});





