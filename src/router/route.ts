/**
 * 解析url 正则表达式
 * @type {RegExp}
 * @private
 */
const RULE_RE = /([^<]*)<(?:([a-zA-Z_][a-zA-Z0-9_]*):)?([a-zA-Z_][a-zA-Z0-9_]*)>/g;

/**
 * parse url rule
 * 
 * @param {string} rule 
 */
function* _parse_rule(rule: string) {
    let pos = 0;
    let end = rule.length;
    let usedNames = new Set();

    RULE_RE.lastIndex = 0;
    while (pos < end) {
        let result = RULE_RE.exec(rule);
        
        // result [match_input, static, arg_type, arg_name]
        if (result === null) break;
        if (result[1]) yield [null, result[1]];
        let variable = result[3];
        let converter = result[2] || 'default';
        if (usedNames.has(variable)) throw TypeError(`variable name ${variable} used twice.`);
        usedNames.add(variable);
        yield [converter, variable];
        pos = RULE_RE.lastIndex;
    }

    if (pos < end) {
        let remaining = rule.substr(pos);
        if (remaining.indexOf('>') !== -1 || remaining.indexOf('<') !== -1) throw TypeError(`malformed url rule: ${rule}`);
        yield [null, remaining];
    }
}

/**
 * get converter type
 * @param type {string}
 * @return {string}
 * @private
 */
function _getConverter(type: string) {
    let converterTypes = ['str', 'int', 'float', 'path', 'default'];
    if (converterTypes.indexOf(type) === -1) throw TypeError('converter type ' + type + ' is undefined');

    let result = { regex: '', weight: 0 };
    switch (type) {
        case 'str':
            result = { regex: '(\\w+)', weight: 100 };
            break;
        case 'path':
            result = { regex: '(.*?)', weight: 200 };
            break;
        case 'int':
            result = { regex: '(\\d+)', weight: 50 };
            break;
        case 'float':
            result = { regex: '(\\d+\\.\\d+)', weight: 50 };
            break;
        case 'default':
            result = { regex: '(\\w+)', weight: 100 };
            break;
    }
    return result;
}


export class Route {
    rule: string;
    endpoint: string;
    methods: string[];
    weight: number;


    private _regex: RegExp;
    private _variable: string[];

    constructor(rule: string, methods: string[], endpoint: string) {
        this.rule = rule;
        this.endpoint = endpoint;


        this.methods = methods.map(method => {
            return method.toUpperCase();
        })
        if (methods.indexOf('HEAD') === -1 && methods.indexOf('GET') !== -1) {
            this.methods.push('HEAD');
        }


        this._variable = [];
        this.weight = 0;

        this.complie();
    }

    complie() {
        let self = this;
        self._variable = [];
        let regexParts: string[] = [];

        function _build_regex(rule: string) {
            for (let [converter, variable] of _parse_rule(rule)) {
                if (converter === null) { // static part
                    regexParts.push(<string>variable);
                    self.weight += (<string>variable).length;
                } else {
                    let type = _getConverter(converter);
                    self._variable.push(<string>variable);
                    regexParts.push(type.regex);
                    self.weight += type.weight;
                }
            }
        }

        _build_regex(this.rule);

        let regex = '^' + regexParts.join('') + '$';
        self._regex = new RegExp(regex, 'g');
    }

    match(url: string) {
        let result: any = {};

        this._regex.lastIndex = 0;
        let res = this._regex.exec(url);
        if (!res) return null;

        for (let i = 1, len = res.length - 1; i <= len; i++) {
            result[this._variable[i - 1]] = res[i];
        }

        return result;
    }
}






















