import { API_URL } from './constants';

interface ApiConfig {
    baseUrl: string;
    headers: HeadersInit;
}

class Api {
    private baseUrl: string;
    private headers: HeadersInit;
    constructor({ baseUrl, headers }: ApiConfig) {
        this.baseUrl = baseUrl;
        this.headers = headers;
    }

    private checkResponse = (res: Response) => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Error: ${res.status}`);
        }
    };

    getFakeData(region: string, seed: number, page: number, errRate: number) {
        return fetch(
            `${this.baseUrl}/generate/${region}/${seed}/${page}/${errRate}`,
            {
                headers: this.headers,
            }
        ).then((res) => this.checkResponse(res));
    }
}

export const api = new Api({
    baseUrl: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
