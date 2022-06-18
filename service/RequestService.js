export class RequestService {
    static async GET(url) {
        let urlObj = new URL(url);
        let response = await fetch(urlObj);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();         
    }
}