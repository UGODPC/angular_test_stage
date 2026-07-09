import { Service } from '@angular/core';
import axios from 'axios';

@Service()
export class Axios {
    constructor()
    {
        axios.defaults.baseURL = "http://localhost:8080";
        axios.defaults.headers.post["Content-Type"] = "application-json";
    }

    request(method: string, url: string, data: any): Promise<any>
    {
        return axios({method: method, url: url, data: data});
    }
}