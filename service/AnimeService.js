import { RequestService } from "./RequestService.js";

export class AnimeService {
    static buscarAnimes(params) {
        return RequestService.GET("https://api.jikan.moe/v4/anime", params);
    }
}