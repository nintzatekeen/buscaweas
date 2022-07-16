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
                listado = document.createElement("ol");
                listado.id = "listado";
                contenedor.appendChild(listado);
            }
            let elemento = document.createElement("li");
            let enlaceElemento = document.createElement("a");
            enlaceElemento.href = anime.url;
            enlaceElemento.target = "_blank";
            
            let cadenaFecha = anime.aired?.from ?? "";
            let ano = anime.aired?.prop?.from?.year ?? "";
            let mes = anime.aired?.prop?.from?.month ?? "";
            if (mes !== "") {
                mes = `${mes}`.padStart(2, "0");
            }
            let cadenaMesAno = (ano && mes) ? `${mes}/${ano}` : `${(ano ? ano : "")}`;
            
            elemento.dataset.fecha = cadenaFecha;
            elemento.dataset.malId = anime.mal_id;
            let tipo = anime.type ? `[${anime.type}]` : "[Desconocido]";
            enlaceElemento.innerText = `${anime.title}${cadenaMesAno ? ` (${cadenaMesAno})` : ""} ${tipo}`;
    
            elemento.appendChild(enlaceElemento);
            listado.appendChild(elemento);
            Utilidades.ordenarListado();
        }
    }

    static sacarIdDeUrl(url) {
        try {
            let expresion = /^(https?\:\/\/)?(www\.)?myanimelist\.net\/anime\/(\d+)(\/.*)?$/i;
            let resultado = url.match(expresion);
            if (resultado) {
                return Number.parseInt(resultado[3]);
            }
            throw "El enlace proporcionado es incorrecto";
        } catch (e) {
            throw "Enlace mal formado";
        }
    }

    static validarRelacion(entry) {
        return entry && entry.mal_id && entry.mal_id > 0;
    }

    static obtenerDistintosTipos(obtenidos) {
        let types = {};
        Object.entries(obtenidos).forEach(obtenido => {
            let type = obtenido[1].type;
            if (!types[type]) {
                types[type] = [obtenido[0]];
            } else {
                types[type].push(obtenido[0])
            }
        });
        return types;
    }

    static dibujarFiltros(tipos) {
        let contenedor = document.getElementById("filtros");
        Object.keys(tipos).forEach(tipo => {
            let valores = tipos[tipo];
            let longitud = valores?.length ?? 0;
            let caja = document.createElement("input");
            caja.type = "checkbox";
            caja.checked = true;
            caja.id = tipo;
            let etiqueta = document.createElement("label");
            etiqueta.for = tipo;
            etiqueta.innerText = `${tipo != "null" ? tipo : "Desconocido"} (${longitud})`;
            let subcontenedor = document.createElement("div");
            subcontenedor.style.width = "100%";
            subcontenedor.appendChild(caja);
            subcontenedor.appendChild(etiqueta);
            contenedor.appendChild(subcontenedor);
            caja.addEventListener("change", (ev) => {
                if (ev.currentTarget.checked) {
                    [...document.querySelectorAll("#listado > li")]
                    .filter(item => valores.includes(item.dataset.malId))
                    .forEach(elem => elem.style.display = "list-item");
                } else {
                    [...document.querySelectorAll("#listado > li")]
                    .filter(item => valores.includes(item.dataset.malId))
                    .forEach(elem => elem.style.display = "none");
                }

            });
        });
    }
}