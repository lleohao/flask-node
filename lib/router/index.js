const Route = require('./route');
const tools = require('../help/tools');

module.exports = Router;

function Router() {
    this.urlMap = [];
    this.endpoint = {};
}

Router.prototype.add = function add(path, methods, handle) {
    if (typeof path !== 'string') throw TypeError('param `path` should be `string`, not `' + typeof path + '`');

    if (handle === undefined) {
        handle = methods;
        methods = ['get'];
    }
    let name = handle.name;
    if (!name) throw TypeError('handle function Can\'t be an anonymous function');

    this.endpoint[name] = handle;
    let route = new Route(path, methods, name);
    this.urlMap.push(route);
    this.update();
};

Router.prototype.update = function update() {
    function _insertSort(array) {
        let length = array.length,
            j, temp;

        for (let i = 1; i < length; i++) {
            j = i;
            temp = array[i];

            while (j > 0 && array[j - 1] > temp) {
                array[j] = array[j - 1];
                j--;
            }
            array[j] = temp;
        }
    }

    _insertSort(this.urlMap)
};

Router.prototype.build = function build(endpoint, values) {

};

Router.prototype.handle = function handle(req, res) {
    for (let i = 0, len = this.urlMap.length - 1; i < len; i++) {
        if (this.urlMap[i].match(req.pathname)) {
            let endpoint = this.urlMap[i].endpoint;
            let result = this.urlMap[i].match(req.pathname);

            this.endpoint[endpoint].call(null, req, res, result);
            break;
        }
    }
};