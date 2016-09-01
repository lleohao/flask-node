const Router = require('../lib/router');
const handleRouter = Router.handleRouter;
const should = require('should');

describe('Router test', function () {
    describe('base test', function () {
        var router = new Router();

        it('should return Router interface', function () {
            router.should.be.instanceof(Router);
            router.should.have.properties(['prefix']);
        });
    });

    describe('add function test', function () {
        var router = new Router();
        var callback = function callback() {

        };

        it('params path is error', function () {
            should.throws(function () {
                router.add(123, ['get'], callback);
            });
        });

        it('no methods', function () {
            router.add('/', callback);
        });

        it('anonymous function', function () {
            should.throws(function () {
                router.add('/', function () {
                });
            });
        })
    });

    describe('update function test: route is sort by _weight', function () {
        var router = new Router();
        var callback = function callback() {
        };
        router.add('/post/<path:str>', callback);
        router.add('/post/<str:title>', callback);
        router.add('/post', callback);
        router.add('/', callback);

        // console.log(Router.urlMap);
    });

    describe('handleRouter test', function () {
        var router = new Router();

    });
});