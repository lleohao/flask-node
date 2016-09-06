const Router = require('../lib/router');
const handleRouter = Router.handleRouter;
const testTools = Router.testTools;
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
        testTools();

        var callback = function callback() {

        };

        it('no methods', function () {
            router.add('/', callback);
        });

        it('params path is error', function () {
            should.throws(function () {
                router.add(123, ['get'], callback);
            });
        });

    });

    describe('update function test: route is sort by _weight', function () {
        var router = new Router();
        var callback = function callback() {

        };

        testTools();
        router.add('/post/<path:str>', callback);
        router.add('/post/<str:title>', callback);
        router.add('/post', callback);
        router.add('/', callback);

        // ok;
    });

    describe('dynamic router test', function () {
        var router = new Router();

        it('static router /', function (done) {
            testTools();
            router.add('/', ['get'], function index(req, res) {
                req.pathname.should.be.eql('/');
                done();
            });

            handleRouter({ pathname: '/' }, {});
        });

        it('static router /post', function (done) {
            testTools();
            router.add('/post', ['get'], function post(req, res) {
                req.pathname.should.be.eql('/post');
                done();
            });

            handleRouter({ pathname: '/post' }, {});
        });

        it('dynamic router str type', function (done) {
            testTools();
            router.add('/post/<str:title>', function viewPost(req, res, params) {
                params.title.should.be.eql('demo');
                done();
            });

            handleRouter({ pathname: '/post/demo' }, {});
        });

        it('dynamic router path type', function (done) {
            testTools();
            router.add('/post/<path:path>', function pathPost(req, res, params) {
                params.path.should.be.eql('demo/dede');
                done();
            });

            handleRouter({ pathname: '/post/demo/dede' }, {});
        });
    });
});