/// <reference path="../typings/index.d.ts" />
const tool = require('./help/tools');

const Response = function(res) {
    this.rawResponse = this.$res = res;
};

/**
 * 内部方法：统一 response 配置
 */
Response.prototype.__end = function() {

};

/**
 * 内部方法：检测传入参数是否有误
 * 
 * @param  {object} data
 */
Response.prototype.__check = function(data) {

};

/**
 * 设置 cookie
 * 
 * @param   {object} cookies 需要设置的cookie
 */
Response.prototype.set_cookies = function(cookie) {

};

/**
 * 响应错误
 * 
 * @param  {number} httpCode http 状态码
 */
Response.prototype.abort = function(httpCode) {

};

/**
 * 响应网页跳转
 * 
 * @param  {string} url 跳转url
 */
Response.prototype.redirect = function(url) {

};

/**
 * 模版渲染
 * 
 * @param  {string} templatePaht 模版路径
 * @param  {object} data 模版填充内容
 */
Response.prototype.render_template = function(templatePaht, data) {

};

/**
 * 返回字符串快速方法
 * 
 * @param   {string} str 返回内容
 */
Response.prototype.str = function(str) {

};

/**
 * 响应 json 数据
 * 
 * @param  {json} data json对象
 */
Response.prototype.jsonify = function(data) {
    
};

module.exports = Response;