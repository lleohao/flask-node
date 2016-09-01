const Route = require('../lib/router/route');
const should = require('should');

describe('Route test', function () {
    describe('base test', function () {
        var route = new Route('/', ['get'], 'index');
        it('should return route instance', function () {
            route.should.be.an.Object();
            route.should.be.instanceof(Route);
        });
        it('should have some properties', function () {
            route.should.have.properties(['rule', 'endpoint', 'methods', '_regex', '_variable', '_isDynamic'])
        });
    });

    describe('methods params test', function () {
        it('methods is null', function () {
            var route = new Route('/', null, 'index');
            should(route.methods).be.Null();
        });

        it('methods is string', function () {
            should.throws(function () {
                new Route('/', 'get', 'index');
            });
        })
    });

    describe('complie test', function () {
        it('simple rule', function () {
            var route = new Route('/', ['get'], 'index');

            route._regex_str.should.be.eql('^/$');
            route._isDynamic.should.be.not.ok();
        });

        it('simple rule 2', function () {
            var route = new Route('/post/category/tag', ['get'], 'index');

            route._regex_str.should.be.eql('^/post/category/tag$');
            route._isDynamic.should.be.not.ok();
        });

        it('dynamic rule', function () {
            var route = new Route('/post/<category>', ['get'], 'index');

            route._regex_str.should.be.eql('^/post/(\\w+)$');
            route._isDynamic.should.be.ok();
            route._variable.should.be.eql(['category']);
        });

        it('dynamic rule with type', function () {
            var route1 = new Route('/post/<category>', ['get'], 'index');
            var route2 = new Route('/post/<str:category>', ['get'], 'index');
            var route3 = new Route('/page/<int:id>', ['get'], 'index');
            var route4 = new Route('/details/<float:number>', ['get'], 'index');
            var route5 = new Route('/action/<path:tag>', ['get'], 'index');

            route1._regex_str.should.be.eql('^/post/(\\w+)$');
            route2._regex_str.should.be.eql('^/post/(\\w+)$');
            route3._regex_str.should.be.eql('^/page/(\\d+)$');
            route4._regex_str.should.be.eql('^/details/(\\d+\\.\\d+)$');
            route5._regex_str.should.be.eql('^/action/(.*?)$');
        });

        it('more dynamic', function () {
            var route = new Route('/post/<str:category>/operate/<int:id>/<action>', ['get'], 'index');
            route._regex_str.should.be.eql('^/post/(\\w+)/operate/(\\d+)/(\\w+)$');
            route._variable.should.be.eql(['category', 'id', 'action']);
        });
    });

    describe('match test', function () {
        it('simple rule', function () {
            var route = new Route('/', ['get'], 'index');

            should(route.match('/')).be.eql({});
            should(route.match('/dd')).be.Null();
        });

        it('simple rule 2', function () {
            var route = new Route('/post/category/tag', ['get'], 'index');

            should(route.match('/post/category/tag')).be.eql({});
            should(route.match('/post/category/tag/dd')).be.Null();
        });

        it('dynamic rule', function () {
            var route = new Route('/post/<category>', ['get'], 'index');

            should(route.match('/post/normal')).be.eql({category: 'normal'});
            should(route.match('/post/javascript')).be.eql({category: 'javascript'});
            should(route.match('/post/')).be.Null();
            should(route.match('/post/normal/1')).be.Null();
        });

        it('dynamic rule with type', function () {
            var route1 = new Route('/post/<str:category>', ['get'], 'index');
            var route2 = new Route('/page/<int:page>', ['get'], 'index');
            var route3 = new Route('/details/<float:number>', ['get'], 'index');
            var route4 = new Route('/action/<path:operate>', ['get'], 'index');

            should(route1.match('/post/normal')).be.eql({category: 'normal'});
            should(route1.match('/post/')).be.Null();

            should(route2.match('/page/123')).be.eql({page: '123'});
            should(route2.match('/post/123d')).be.Null();

            should(route3.match('/details/12.3')).be.eql({number: '12.3'});
            should(route3.match('/details/123')).be.Null();

            should(route4.match('/action/delete/d')).be.eql({operate: 'delete/d'});
            should(route4.match('/action/')).be.eql({operate: ''});
        });

        it('more dynamic', function () {
            var route = new Route('/post/<str:category>/operate/<int:id>/<action>', ['get'], 'index');

            should(route.match('/post/normal/operate/15/delete')).be.eql({
                category: 'normal',
                id: '15',
                action: 'delete'
            })
        });
    })
});