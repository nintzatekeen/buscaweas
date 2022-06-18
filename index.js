import { Relacion } from "./model/Relacion.js";

window.onload = () => {
    document.getElementById("formulario").addEventListener("submit", e => {
        let relacion = new Relacion();
        e.preventDefault();
        relacion.borrarContenido();
        relacion.omitirResumenes = e.currentTarget.elements["resumenes"].checked;
        let url = e.currentTarget.elements["url"].value;
        relacion.sagase(url).then(() => {
            window.alert(`BÚSQUEDA REALIZADA.\nTOTAL: ${Object.keys(relacion.obtenidos).length} relacionados`);
            document.getElementById("buscando").innerHTML = "";
            console.log(relacion.obtenidos);
        }).catch(err => {
            window.alert("Como el programador es un tolili, o el servidor está tocando las weas, la búsqueda ha fallado... Puta bida...");
            console.error(err);
        });
    });
}