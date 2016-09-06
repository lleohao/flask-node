/// <reference path='../../typings/index.d.ts' />
const global = require('../global');
const colors = require('colors');

colors.setTheme(global.$Other.colorsTheme);

module.exports = {
    setHeaders: function (headers, res) {
        for (let key in headers) {
            //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
            res.setHeader(key, headers[key]);
        }
    },
    colors: colors
};
