import * as swig from 'swig';
import { join } from 'path';

import { Configs } from './configs';

/**
 * Render Function interface
 * @private
 */
export interface RenderFunction {
    (templatePath: string, data?: Object): string;
}

/**
 *
 * @param configs
 * @private
 */
export function createRender(configs: Configs): RenderFunction {
    const debug = configs.ServerRunningOptions.debug;
    const prefix = configs.flaskOptions.templatesPath;

    if (debug) swig.setDefaults({ cache: false });

    swig.setFilter('static', function(input: string) {
        return './' + configs.flaskOptions.staticUrlPath + '/' + input;
    });

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
