/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/should/index.d.ts" />

import * as should from 'should';
import { Router, handleRouter, urlMap } from '../lib/router';

describe('Router test', function () {
    describe('base test', function () {
        it('Constructor test', function () {
            const prefix = 'main';
            const router = new Router(prefix);

            should(router).be.instanceof(Router);
            should(router.prefix).be.eql(prefix);
        });
    });

    describe('router test', function () {
        let router: Router;

        beforeEach(() => {
            router = new Router();
        });

        afterEach(() => {
            router = null;
        });

        it('anonymous test', () => {
            should.throws(() => {
                router.add('/test', () => {
                    return 'ok';
                })
            })
        });

        it('add test', () => {
            const addTest = function addTest() {
                return 'ok';
            }

            router.add('addTest', ['get'], addTest);

            should(urlMap.length).be.eql(1);
        });

        it('urlMap test', () => {
            const handle1 = function addTest() {
                return 'ok';
            }
            const handle2 = function addTest() {
                return 'ok';
            }
            const handle3 = function addTest() {
                return 'ok';
            }

            router.add('urlMap/<path:test1>', handle1);
            router.add('urlMap', handle2);
            router.add('urlMap/<url>', handle3);

            let flag = true;
            for (let i = 0, len = urlMap.length; i < len - 2; i++) {

                if (urlMap[i].weight > urlMap[i + 1].weight) {
                    flag = false;
                }
            }

            should(flag).be.eql(true);
        })
    });
});
