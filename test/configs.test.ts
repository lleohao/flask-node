/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/should/index.d.ts" />

import { normalize, join, resolve } from 'path';
import * as should from 'should';
import { Configs, FlaskOptions, RunTimeOptions } from '../src/configs';

describe('configs test', () => {
    it('constructor test', () => {
        const config = new Configs();

        should(config).be.instanceOf(Configs);

        should(config.flaskOptions).be.eql({
            rootPath: '',
            staticUrlPath: '',
            staticRootPath: '',
            templatesPath: ''
        });

        should(config.staticServerOptions).be.eql({
            cache: 3600,
            gzip: true,
            headers: {}
        });

        should(config.runTimeOptions).be.eql({
            debug: false,
            port: 5050,
            hostname: 'localhost'
        });
    });


    describe('setConfig test', () => {
        let config: Configs;

        beforeEach(() => {
            config = new Configs();
        });
        afterEach(() => {
            config = null;
        });

        it('throw RangeError', () => {
            should.throws(() => {
                config.setConfigs('.', {
                    staticUrlPath: '../'
                })
            });
        })

        it('Set the path correctly', () => {
            let rootPath = __dirname;
            let options = {};

            config.setConfigs(rootPath, options);

            should(config.flaskOptions).be.eql({
                rootPath: rootPath,
                staticUrlPath: normalize('static').replace('\\', '/'),
                staticRootPath: resolve(join(rootPath, 'static')),
                templatesPath: resolve(join(rootPath, 'templates'))
            });
        });

        it('Set the staticOptions correctly', () => {
            let rootPath = __dirname;
            let options: FlaskOptions = {
                staticOptions: {
                    gzip: false,
                    cache: 36000
                }
            };

            config.setConfigs(rootPath, options);

            should(config.staticServerOptions).be.eql({
                cache: 36000,
                gzip: false,
                headers: {}
            });
        })
    });

    describe('setRunTime test', () => {
        let config: Configs;

        beforeEach(() => {
            config = new Configs();
        });
        afterEach(() => {
            config = null;
        });

        it('Set the runTimeOptions correctly', () => {
            let options: RunTimeOptions = {
                debug: true,
                port: 5555,
                hostname: 'test.com'
            };

            config.setRunTime(options);
            should(config.runTimeOptions).be.eql({
                debug: true,
                port: 5555,
                hostname: 'test.com'
            })
        })
    })
});

