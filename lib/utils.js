/**
 * Created by hzzhouhao1 on 2016/9/6.
 */
const colors = require('colors');

let colorsTheme = {
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
};
colors.setTheme(colorsTheme);


module.exports.colors = colors;
module.exports.setHeaders = function (headers, res) {
    let keys = Object.keys(headers);
    keys.map(key=> {
        res.setHeader(key, headers[key]);
    });
};