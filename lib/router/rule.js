/**
 * url rule regexp
 * @type {RegExp}
 * @private
 * @example /page/<str:id>/action/<action>
 *     [ '/page/<str:id>',
 *        '/page/',
 *        'str',
 *        undefined,
 *        'id',
 *        index: 0,
 *        input: '/page/<str:id>/action/<action>' ]
 *        [ '/action/<action>',
 *        '/action/',
 *        undefined,
 *        undefined,
 *        'action',
 *        index: 14,
 *        input: '/page/<str:id>/action/<action>' ]
 */
const _rule_re = /([^<]*)<(?:([a-zA-Z_][a-zA-Z0-9_]*)(?:(.*?))?\:)?([a-zA-Z_][a-zA-Z0-9_]*)>/g;
const _simple_rule_re = /<([^>]+)>/g;
const _converter_args_re = /([^<]*)<(?:([a-zA-Z_][a-zA-Z0-9_]*)(?:(.*?))?\:)?([a-zA-Z_][a-zA-Z0-9_]*)>/g;