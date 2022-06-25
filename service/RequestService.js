export class RequestService {

    static async GET(url, params) {
        let urlObj = new URL(url);
        if (params) {
            Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));
        }
        let response = await fetch(urlObj);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();           
    }
}