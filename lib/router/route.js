const util = require('util');

/**
 * 解析url 正则表达式
 * @type {RegExp}
 * @private
 */
const _rule_re = /([^<]*)<(?:([a-zA-Z_][a-zA-Z0-9_]*):)?([a-zA-Z_][a-zA-Z0-9_]*)>/g;

/**
 * 解析url函数
 * @param rule {String} url rule
 * @private
 * @return {Object}
 */
function* _parse_rule(rule) {
    let pos = 0;
    let end = rule.length;
    let usedNames = new Set();
    while (pos < end) {
        let result = _rule_re.exec(rule);
        // result [match_input, static, arg_type, arg_name]
        if (result === null) break;
        if (result[1]) yield [null, result[1]];
        let variable = result[3];
        let converter = result[2] || 'default';
        if (usedNames.has(variable)) throw TypeError('variable name %s used twice.', variable);
        usedNames.add(variable);
        yield [converter, variable];
        pos = _rule_re.lastIndex;
    }

    if (pos < end) {
        let remaining = rule.substr(pos);
        if (remaining.indexOf('>') != -1 || remaining.indexOf('<') != -1) throw TypeError('malformed url rule: ' + rule);
        yield [null, remaining];
    }
}

/**
 * get converter type
 * @param type {string}
 * @return {string}
 * @private
 */
function _getConverter(type) {
    let converterTypes = ['str', 'int', 'float', 'path', 'default'];
    if (converterTypes.indexOf(type) === -1) throw TypeError('converter type ' + type + ' is undefined');

    let regex = '';
    switch (type) {
        case 'str':
            regex = '(\\w+)';
            break;
        case 'path':
            regex = '(.*?)';
            break;
        case 'int':
            regex = '(\\d+)';
            break;
        case 'float':
            regex = '(\\d+\\.\\d+)';
            break;
        case 'default':
            regex = '(\\w+)';
            break;
    }
    return regex;
}

/**
 * Route class
 * @param rule {String} url rule
 * @param methods {Array} http methods
 * @param endpoint {String}
 * @constructor
 */
function Route(rule, methods, endpoint) {
    this.rule = rule;
    this.endpoint = endpoint;

    if (methods === null) this.methods = null;
    else {
        if (typeof methods === 'string') throw TypeError('param `methods` should be `Array[string]`, not `string`');
        this.methods = methods.map(item => {
            return item.toUpperCase();
        });
        if (methods.indexOf('HEAD') == -1 && methods.indexOf('GET')) this.methods.push('HEAD');
    }

    this._regex = null;
    this._variable = null;
}

/**
 * build regex
 */
Route.prototype.complie = function compile() {
    let self = this;
    self._variable = [];
    let regexParts = [];

    function _build_regex(rule) {
        for (let [converter, variable] of _parse_rule(rule)) {
            if (converter === null) { // static part
                regexParts.push(variable);
            } else {
                self._variable.push(variable);
                regexParts.push(_getConverter(converter));
            }
        }
    }

    _build_regex(this.rule);

    let regex = '^' + regexParts.join('') + '$';
    self._regex = new RegExp(regex, 'g');
};

/**
 * @param url {string}
 * @return {*}
 */
Route.prototype.match = function match(url) {
    let result = {};

    let res = this._regex.exec(url);
    if(!res) return null;
    for(let i = 1, len = res.length - 1; i <= len; i++) {
        result[this._variable[i-1]] = res[i];
    }

    return result;
};

Route.prototype.bind = function (map) {

};























