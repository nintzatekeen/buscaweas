export class Utilidades {

    constructor(){
    }

    static buscandoEn(url) {
        let buscando = document.getElementById("buscando");
        buscando.innerText = `BUSCANDO EN: ${url}`;
    }

    static comparador(a, b) {
        if (a.dataset.fecha < b.dataset.fecha)
            return -1;
        if (a.dataset.fecha > b.dataset.fecha)
            return 1;
        return 0;
    }

    static obtenerRelacionados(anime) {
        if (!anime) {
            throw "No ha proporcionado ningún anime";
        }
        if (anime.data)
            return anime.data.relations;
        return [];
    }

    static ordenarListado() {
        let listado = document.getElementById("listado");
        if (listado) {
            let elementos = listado.getElementsByTagName("li");
            let arregloElementos = Array.from(elementos);
            arregloElementos.sort(Utilidades.comparador);
            for (let elemento of arregloElementos) {
                listado.appendChild(elemento);
            }
        }
    }

    static anadirAlContenedor(anime) {
        if (anime) {
            let contenedor = document.getElementById("contenedor");
            let listado = document.getElementById("listado");
            if (!listado) {
                listado = document.createElement("ul");
                listado.id = "listado";
                contenedor.appendChild(listado);
            }
            let elemento = document.createElement("li");
            let enlaceElemento = document.createElement("a");
            enlaceElemento.href = anime.url;
            enlaceElemento.target = "_blank";
            
            let cadenaFecha = anime.aired ? anime.aired.from : "";
            let ano = (anime.aired && anime.aired.prop && anime.aired.prop.from) ? "" + anime.aired.prop.from.year : "";
            let mes = (anime.aired && anime.aired.prop && anime.aired.prop.from) ? "" + anime.aired.prop.from.month : "";
            if (mes.length < 2) {
                mes = "0" + mes;
            }
            let cadenaMesAno = (ano && mes) ? `${mes}/${ano}` : `${mes}${ano}`;
            
            elemento.dataset.fecha = cadenaFecha;
            enlaceElemento.innerText = `${anime.title}${cadenaMesAno ? ` (${cadenaMesAno})` : ""}`;
    
            elemento.appendChild(enlaceElemento);
            listado.appendChild(elemento);
            Utilidades.ordenarListado();
        }
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

    static validarRelacion(entry) {
        return entry && entry.mal_id && entry.mal_id > 0;
    }
}