import { RelacionService } from "../service/RelacionService.js";
import { Utilidades } from "../service/Utilidades.js";

export class Relacion {

    constructor() {
        this.omitirResumenes = false;
        this.obtenidos = {};
    }

    anadirRelaciones(relaciones) {
        let nuevasUrl = [];
        if (relaciones) {
            let omitidos = ["Adaptation"]; 
            if (this.omitirResumenes) {
                omitidos.push("Summary");
            }
            relaciones.filter(r => !omitidos.includes(r.relation)).forEach(chingadera => {
                for (let entry of chingadera.entry) {
                    if (entry.type === "anime" && !this.obtenidos[entry.mal_id]) {
                        this.obtenidos[entry.mal_id] = {
                            mal_id: entry.mal_id,
                            url: entry.url
                        };
                        nuevasUrl.push(entry.url);
                    }
                }
            });
        }
        return nuevasUrl;
    }

    rellenarAnime(anime) {
        if (anime && anime.mal_id) {
            this.obtenidos[anime.mal_id] = anime;
        }
    }

    borrarContenido() {
        document.getElementById("contenedor").innerHTML = "";
        this.obtenidos = {};
    }

    async sagase(url) {
        return new Promise((resolve, reject) => setTimeout(async () => {
            try {
                Utilidades.buscandoEn(url);
                let id = RelacionService.sacarIdDeUrl(url);
                let anime = await RelacionService.obtenerAnime(id);
                if (anime) {
                    this.rellenarAnime(anime.data);
                    Utilidades.anadirAlContenedor(anime.data);
                }
                let relaciones = Utilidades.obtenerRelacionados(anime);
                let nuevasRelaciones = this.anadirRelaciones(relaciones);
                for await (let nuevaUrl of nuevasRelaciones) {
                    await this.sagase(nuevaUrl);
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        }, 1000));
    }

}