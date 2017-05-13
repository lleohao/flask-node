/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/should/index.d.ts" />

import * as should from 'should';
import { createRender } from '../lib/render';
import { Configs  } from '../lib/configs';

const configs = new Configs();
const render = createRender(configs);

describe('render test', () => {
    it('return string template', () => {
        const template = '<h1>hello world</h1>';

        should(render(template)).be.eql(template);
    })

    it('return string template with data', () => {
        const template = '<h1>hello {{ name }}</h1>';

        should(render(template, {
            name: 'lleohao'
        })).be.eql('<h1>hello lleohao</h1>');
    });
});