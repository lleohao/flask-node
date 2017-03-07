import { ServerResponse } from 'http';

export interface ResponseData {
    response: string;
    status: number;
    headers: Object
}


export class Response {
    private res: ServerResponse;

    constructor(res: ServerResponse) {
        this.res = res;
    }

    private finish(status, headers, data) {

    }

    setCookie() {

    }

    end(response: string | ResponseData, status?: number) {
        this.finish(status, (<ResponseData>response).headers, (<ResponseData>response).headers);
    }

    abort() {

    }

    redirect(url: string) {
        
    }
}