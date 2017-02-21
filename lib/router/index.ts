import { Route } from './route';


export let urlMap: Route[] = [];
let endpoint: any = {};

// FIXME: 等待修复req res 模块
export function handleRouter(req: any, res: any) {
    let i = 0,
        len = urlMap.length;
    for (; i < len; i++) {
        let result = urlMap[i].match(req.pathname);
        if (result) {
            let endpointName = urlMap[i].endpoint;

            endpoint[endpointName].call(null, req, res, result);
            break;
        }
    }

    if (i < len) errorHandle(req, res);
}

// TODO: 添加全局的错误处理
function errorHandle(req: any, res: any) {

}

function _insertSort(array: Route[]) {
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
    prefix: string;

    constructor(prefix: string = '') {
        this.prefix = prefix;
    }

    add(path: string, methods: string[] | Function, handle?: Function | undefined) {
        if (handle === undefined) {
            handle = <Function>methods;
            methods = ['get'];
        }

        let name = handle.name;
        if (!name) throw TypeError('handle function Can\'t be an anonymous function');

        let route = new Route(path, <string[]>methods, name);
        urlMap.push(route);
        endpoint[name] = handle;
        _insertSort(urlMap)
    }
}
