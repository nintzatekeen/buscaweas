import { AnimeElement } from "./component/AnimeElement.js";
import { Relacion } from "./model/Relacion.js";
import { Utilidades } from "./service/Utilidades.js";

if(!window.customElements.get('anime-element')) {
    window.customElements.define("anime-element", AnimeElement);
}

window.onload = () => {
    let eremento = new AnimeElement();
    eremento.alSeleccionar((anime) => {
        if (anime) {
            let campoUrl = document.querySelector("#campoUrl");
            if(campoUrl) {
                campoUrl.value=anime.url;
            }
        }
    });
    document.querySelector("#formulario").appendChild(eremento);
    document.getElementById("formulario").addEventListener("submit", e => {
        let relacion = new Relacion();
        e.preventDefault();
        relacion.borrarContenido();
        relacion.omitirResumenes = e.currentTarget.elements["resumenes"].checked;
        relacion.omitirOtros = e.currentTarget.elements["otros"].checked;
        relacion.omitirCharacter = e.currentTarget.elements["character"].checked;
        let url = e.currentTarget.elements["url"].value;
        let id = Utilidades.sacarIdDeUrl(url);
        let entry = {mal_id: id, url: url};
        relacion.sagase(entry).then(() => {
            window.alert(`BÚSQUEDA REALIZADA.\nTOTAL: ${Object.keys(relacion.obtenidos).length} relacionados`);
            document.getElementById("buscando").innerHTML = "";
            console.log(relacion.obtenidos);
        }).catch(err => {
            window.alert("Como el programador es un tolili, o el servidor está tocando las weas, la búsqueda ha fallado... Puta bida...");
            console.error(err);
        });
    });
}