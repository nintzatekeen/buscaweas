import { RelacionService } from "../service/RelacionService.js";
import { Utilidades } from "../service/Utilidades.js";

export class Relacion {

    omitirResumenes;
    omitirOtros;
    omitirCharacter;
    obtenidos;

    constructor() {
        this.omitirOtros = false;
        this.omitirResumenes = false;
        this.omitirCharacter = false;
        this.obtenidos = {};
    }

    anadirRelaciones(relaciones) {
        let nuevasRelaciones = [];
        if (relaciones) {
            let omitidos = ["Adaptation"]; 
            if (this.omitirResumenes) {
                omitidos.push("Summary");
            }
            if (this.omitirOtros) {
                omitidos.push("Other");
            }
            if (this.omitirCharacter) {
                omitidos.push("Character");
            }
            relaciones.filter(r => !omitidos.includes(r.relation)).forEach(chingadera => {
                for (let entry of chingadera.entry) {
                    if (Utilidades.validarRelacion(entry) && entry.type === "anime" && !this.obtenidos[entry.mal_id]) {
                        this.obtenidos[entry.mal_id] = {
                            mal_id: entry.mal_id,
                            url: entry.url
                        };
                        nuevasRelaciones.push(entry);
                    }
                }
            });
        }
        return nuevasRelaciones;
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

    async sagase(entry) {
        return new Promise((resolve, reject) => setTimeout(async () => {
            try {
                Utilidades.buscandoEn(entry.url);
                let id = /*RelacionService.sacarIdDeUrl(url)*/entry.mal_id;
                let anime = await RelacionService.obtenerAnime(id);
                if (anime) {
                    this.rellenarAnime(anime.data);
                    Utilidades.anadirAlContenedor(anime.data);
                }
                let relaciones = Utilidades.obtenerRelacionados(anime);
                let nuevasRelaciones = this.anadirRelaciones(relaciones);
                for await (let nuevaRelacion of nuevasRelaciones) {
                    await this.sagase(nuevaRelacion);
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        }, 1000));
    }

}