import { Route } from './route';
import { Request } from '../request';
import { Response } from '../response';

/**
 * Save all url <-> endpoint map
 */
const endpoints: any = {};

/**
 * All route array list
 * @private
 */
export const routeList: Route[] = [];

/**
 * inster sourt
 * @param array
 * @private
 */
const _insertSort = function _insertSort(array: Route[]) {
    let length = array.length,
        j,
        temp;

    for (let i = 1; i < length; i++) {
        j = i;
        temp = array[i];

        while (j > 0 && array[j - 1].weight > temp.weight) {
            array[j] = array[j - 1];
            j--;
        }
        array[j] = temp;
    }
};

/**
 * According the request to select the appropriate handler
 * @param req
 * @param res
 * @private
 */
export function handleRouter(req: Request, res: Response) {
    let i = 0,
        len = routeList.length;
    for (; i < len; i++) {
        let result = routeList[i].match(req.pathname);
        if (result) {
            let endpointName = routeList[i].endpoint;

            req.parse((err: Error) => {
                if (err !== null) {
                    res.end(err.message, 500);
                } else {
                    endpoints[endpointName].call(null, req, res, result);
                }
            });
            break;
        }
    }

    if (i === len) {
        res.end('404 Not Found', 404);
    }
}

/**
 * Router class
 */
export class Router {
    readonly prefix: string;

    /**
     * Create a router instance
     * @param prefix - the prefix string will add to URL rule before
     */
    constructor(prefix: string = '') {
        this.prefix = prefix;
    }

    /**
     * A method that is used to register a view function for a given URL rule.
     * @param url - the URL rule as string
     * @param methods - the HTTP method list
     * @param endpoint - the view function
     */
    public add(
        url: string,
        methods: string[] | Function,
        endpoint?: Function | undefined
    ) {
        if (endpoint === undefined) {
            endpoint = <Function>methods;
            methods = ['get'];
        }

        const name = endpoint.name;
        if (!name)
            throw TypeError(`handle function Can't be an anonymous function`);

        if (this.prefix !== '') {
            url = '/' + this.prefix + url;
        }

        routeList.push(new Route(url, <string[]>methods, name));
        endpoints[name] = endpoint;

        _insertSort(routeList);
    }
}
