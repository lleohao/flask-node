/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/should/index.d.ts" />

import * as should from 'should';
import { Route } from '../src/router/route';

describe('Route test', function () {
    describe('base test', function () {
        let route = new Route('/', ['get'], 'index');
        it('should return route instance', function () {
            route.should.be.an.Object();
            route.should.be.instanceof(Route);
        });
    });

    describe('complie test', function () {
        it('error test', function () {
            should.throws(function () {
                new Route('/post/<id>/<id>', ['get'], 'index');
            });

            should.throws(function () {
                new Route('/post/<id', ['get'], 'index');
            });

            should.throws(function () {
                new Route('/post/<ddd:dd>', ['get'], 'index');
            });
        })
    });

    describe('match test', function () {
        it('simple rule', function () {
            let route = new Route('/', ['get'], 'index');

            should(route.match('/')).be.eql({});
            should(route.match('/dd')).be.Null();
        });

        it('simple rule 2', function () {
            let route = new Route('/post/category/tag', ['get'], 'index');

            should(route.match('/post/category/tag')).be.eql({});
            should(route.match('/post/category/tag/dd')).be.Null();
        });

        it('dynamic rule', function () {
            let route = new Route('/post/<category>', ['get'], 'index');

            should(route.match('/post/normal')).be.eql({ category: 'normal' });
            should(route.match('/post/javascript')).be.eql({ category: 'javascript' });
            should(route.match('/post/')).be.Null();
            should(route.match('/post/normal/1')).be.Null();
        });

        it('dynamic rule with type', function () {
            let route1 = new Route('/post/<str:category>', ['get'], 'index');
            let route2 = new Route('/page/<int:page>', ['get'], 'index');
            let route3 = new Route('/details/<float:number>', ['get'], 'index');
            let route4 = new Route('/action/<path:operate>', ['get'], 'index');

            should(route1.match('/post/normal')).be.eql({ category: 'normal' });
            should(route1.match('/post/')).be.Null();

            should(route2.match('/page/123')).be.eql({ page: '123' });
            should(route2.match('/post/123d')).be.Null();

            should(route3.match('/details/12.3')).be.eql({ number: '12.3' });
            should(route3.match('/details/123')).be.Null();

            should(route4.match('/action/delete/d')).be.eql({ operate: 'delete/d' });
            should(route4.match('/action/')).be.eql({ operate: '' });
        });

        it('more dynamic', function () {
            let route = new Route('/post/<str:category>/operate/<int:id>/<action>', ['get'], 'index');

            should(route.match('/post/normal/operate/15/delete')).be.eql({
                category: 'normal',
                id: '15',
                action: 'delete'
            })
        });
    })
});