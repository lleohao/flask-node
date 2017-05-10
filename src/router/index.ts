import { Route } from './route';
import { Request } from '../request';
import { Response } from '../response';


export const urlMap: Route[] = [];
const endpoint: any = {};

export function handleRouter(req: Request, res: Response) {
    let i = 0,
        len = urlMap.length;
    for (; i < len; i++) {
        let result = urlMap[i].match(req.pathname);
        if (result) {
            let endpointName = urlMap[i].endpoint;

            req.parse(() => {
                endpoint[endpointName].call(null, req, res, result);
            })
            break;
        }
    }

    if (i < len) {
        res.end('404 Not Found', 404);
    }
}

const _insertSort =  function _insertSort(array: Route[]) {
    let length = array.length,
        j, temp;

    for (let i = 1; i < length; i++) {
        j = i;
        temp = array[i];

        while (j > 0 && array[j - 1].weight > temp.weight) {
            array[j] = array[j - 1];
            j--;
        }
        array[j] = temp;
    }
}

export class Router {
    readonly prefix: string;

    constructor(prefix: string = '') {
        this.prefix = prefix;
    }

    add(path: string, methods: string[] | Function, handle?: Function | undefined) {
        if (handle === undefined) {
            handle = <Function>methods;
            methods = ['get'];
        }

        const name = handle.name;
        if (!name) throw TypeError('handle function Can\'t be an anonymous function');

        path = this.prefix + '/' + path;  
              
        urlMap.push(new Route(path, <string[]>methods, name););
        endpoint[name] = handle;
        
        _insertSort(urlMap)
    }
}
