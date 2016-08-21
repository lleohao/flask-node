const should = require('should');
const Response = require('../lib/response');

const response = {
    code: undefined,
    headers: {},
    data: undefined
};
response.setHeaders = function (name, value) {
    this.headers[name] = value;
};
response.writeHead = function (code, object) {
    this.code = code;
    this.headers = Object.assign(this.headers, object);
};
response.end = function (data) {
    this.data = data;
};

describe('response.js test', function () {
    describe('实例化测试', function () {
        it('实例化 success', function () {
            let res = new Response(response);

            res.should.be.an.object;
            res.$res.should.be.an.object;
        })
    });

    describe('内部方法测试', function () {
        let res = new Response(response);

        it('__end success', function () {
            res.__end("ok");
            res.$res.data.should.be.equal("ok");
        });

        it('__check success', function () {
            (function () {
                res.__check('username', 'string', 'lleohao');
            }).should.not.throw();
            (function () {
                res.__check('username', 'string', 1)
            }).should.throw(TypeError('username is must be a string'));

            (function () {
                res.__check('username', 'lleohao');
            }).should.not.throw();
            (function () {
                res.__check('username');
            }).should.throw(TypeError('username is undefined'));
        });
    });

    describe('公共方法测试', function () {
        let res = new Response(response);
        it('set_cookies success', function () {
            res.set_cookies('username', 'lleohao');
            res.set_cookies({'age': '18', 'email': 'test@c.com'});
            should(res.$res.headers).have.property('Set-Cookie');
        });

        it('abort success', function () {
            (function () {
                res.abort(100)
            }).should.throw();

            res.abort(404);
            should(res.$res.code).be.equal(404);
            should(res.$res.data).be.equal('404 Error');
        });

        it('redirect success', function () {
            res.redirect('lleohao.com');

            should(res.$res.code).be.equal(302);
            should(res.$res.headers).have.property('Location');
            should(res.$res.headers.Location).be.equal('lleohao.com');
        });

        it('render_template success', function () {
            res.render_template('<h1>{{ name }}</h1>', {name: 'lleohao'});

            should(res.$res.code).be.equal(200);
            should(res.$res.headers).have.property('Content-Type');
            should(res.$res.data).be.equal('<h1>lleohao</h1>');
        });

        it('str test1 success', function () {
            res.str('ok');

            should(res.$res.code).be.equal(200);
            should(res.$res.headers['Content-Type']).be.equal('text/palin');
            should(res.$res.data).be.equal('ok');
        });

        it('str test2 success', function () {
            res.str('ok', true);

            should(res.$res.headers['Content-Type']).be.equal('text/html');
        });

        it('jsonify success', function () {
            res.jsonify({
                name: 'lleohao'
            });

            should(res.$res.code).be.equal(200);
            should(res.$res.headers['Content-Type']).be.equal('application/json');
            should(res.$res.data).be.equal('{"name":"lleohao"}');
        });
    });
});




