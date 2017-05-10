/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/should/index.d.ts" />

import { createServer, get, request } from 'http';
import { stringify } from 'querystring';
import * as should from 'should';
import { Request } from '../lib/request';

describe('Request test', () => {
    it('headers test', (done) => {
        let server = createServer((req, res) => {
            const request = new Request(req);

            res.end(request.headers('test'));
        });
        server.listen(5050);

        get({
            port: 5050,
            headers: {
                test: 'test'
            }
        }, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                should(data.toString()).be.eql('test');
                done();
                server.close();
            })
        })
    });

    it('cookies test', (done) => {
        let server = createServer((req, res) => {
            const request = new Request(req);

            res.end(request.cookies('test'));
        });
        server.listen(5050);

        get({
            port: 5050,
            headers: {
                cookie: 'test=test'
            }
        }, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                should(data.toString()).be.eql('test');
                done();
                server.close();
            })
        })
    });

    it('args test', (done) => {
        let server = createServer((req, res) => {
            const request = new Request(req);

            res.end(request.args('test'));
        });
        server.listen(5050);

        get({
            port: 5050,
            path: '/?test=test'
        }, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                should(data.toString()).be.eql('test');
                done();
                server.close();
            })
        })
    });

    it('values test', (done) => {
        let server = createServer((req, res) => {
            const request = new Request(req);

            res.end(request.values('test'));
        });
        server.listen(5050);

        get({
            port: 5050,
            path: '/?test=test'
        }, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                should(data.toString()).be.eql('test');
                done();
                server.close();
            })
        })
    });

    it('form test', (done) => {
        let server = createServer((req, res) => {
            const request = new Request(req);

            request.parse().on('end', () => {
                res.end(request.form('test'));
            })
        });
        server.listen(5050);

        const postData = stringify({
            'test': 'test'
        });

        let req = request({
            port: 5050,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                should(data.toString()).be.eql('test');
                done();
                server.close();
            })
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        // write data to request body
        req.write(postData);
        req.end();
    });
});

