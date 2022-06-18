import { RequestService } from "./RequestService.js";

export class RelacionService {
    static async obtenerAnime(id) {
        if (!id) {
            throw "Identificador incorrecto";
        }
        let jikanUrl = `https://api.jikan.moe/v4/anime/${id}/full`;
        return await RequestService.GET(jikanUrl);
    }

    static sacarIdDeUrl(url) {
        try {
            let expresion = /^(http[s]?\:\/\/)?myanimelist\.net\/anime\/(\d+)\/.*$/i;
            let resultado = url.match(expresion);
            if (resultado) {
                return Number.parseInt(resultado[2]);
            }
            throw "El enlace proporcionado es incorrecto";
        } catch (e) {
            throw "Enlace mal formado";
        }
    }

}