import * as swig from 'swig';
import { join } from 'path';

import { Configs } from './configs';

export function createRender(configs: Configs): Function {
    const debug = configs.runTimeOptions.debug;
    const prefix = configs.flaskOptions.templatesPath;

    if (debug) swig.setDefaults({ cache: false });

    swig.setFilter('static', function (input: string) {
        return './' + configs.flaskOptions.staticRootPath + '/' + input;
    });

    /**
     * 封装 swig 操作，返回渲染后的模板
     *
     * @param {string} templatePath 模板路径
     * @param {Object} [data] 填充内容
     * @returns {string} 渲染后的模板
     */
    return function render(templatePath: string, data?: Object): string {
        let template;
        if (/\.html$/.test(templatePath)) {
            let realPath = join(prefix, templatePath);
            template = swig.compileFile(realPath);
        } else {
            template = swig.compile(templatePath);
        }

        return template(data);
    };
}
