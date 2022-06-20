import { RequestService } from "./RequestService.js";

export class RelacionService {
    static async obtenerAnime(id) {
        if (!id) {
            throw "Identificador incorrecto";
        }
        let jikanUrl = `https://api.jikan.moe/v4/anime/${id}/full`;
        return await RequestService.GET(jikanUrl);
    }

}