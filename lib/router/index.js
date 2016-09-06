const Route = require('./route');
const tools = require('../help/tools');

module.exports = Router;
module.exports.handleRouter = handleRouter;
module.exports.testTools = testTools;


let urlMap = [],
    endpoint = {};

function handleRouter(req, res) {
    let i = 0,
        len = urlMap.length;
    for (; i < len; i++) {
        let result = urlMap[i].match(req.pathname);
        if (result) {
            let endpointName = urlMap[i].endpoint;

            endpoint[endpointName].call(null, req, res, result);
            break;
        }
    }

    if (i < len) errorHandle(req, res);
}

function errorHandle(req, res) {

}

/**
 * for test
 */
function testTools() {
    urlMap = [];
}


function Router(prefix) {
    this.prefix = prefix || '';
}

Router.prototype.add = function add(path, methods, handle) {
    if (typeof path !== 'string') throw TypeError('param `path` should be `string`, not `' + typeof path + '`');

    if (handle === undefined) {
        handle = methods;
        methods = ['get'];
    }

    let name = handle.name;
    if (!name) throw TypeError('handle function Can\'t be an anonymous function');

    let route = new Route(path, methods, name);
    urlMap.push(route);
    endpoint[name] = handle;
    this.update();
};

Router.prototype.update = function update() {
    function _insertSort(array) {
        let length = array.length,
            j, temp;

        for (let i = 1; i < length; i++) {
            j = i;
            temp = array[i];

            while (j > 0 && array[j - 1]._weight > temp._weight) {
                array[j] = array[j - 1];
                j--;
            }
            array[j] = temp;
        }
    }

    _insertSort(urlMap)
};

module.exports.urlMap = urlMap;
