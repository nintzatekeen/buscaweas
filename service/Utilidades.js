export class Utilidades {

    constructor(){
    }

    static buscandoEn(url) {
        let buscando = document.getElementById("buscando");
        buscando.innerText = `BUSCANDO EN: ${url}`;
    }

    static comparador(a, b) {
        
        let fechaA = a.dataset.fecha;
        let fechaB = b.dataset.fecha;

        if (!fechaA && !fechaB) {
            return 0;
        } else if (!fechaB) {
            return -1;
        } else if (!fechaA) {
            return 1;
        }
        
        if (fechaA < fechaB) {
            return -1;
        } else if (fechaA > fechaB) {
            return 1;
        }
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

    static ordenarListadoTabla() {
        let listado = document.getElementById("listado");
        let tbody = listado.querySelector("tbody");
        if (listado && tbody) {
            let elementos = listado.querySelectorAll("tbody > tr");
            let arregloElementos = Array.from(elementos);
            arregloElementos.sort(Utilidades.comparador);
            let cont = 1;
            for (let elemento of arregloElementos) {
                tbody.appendChild(elemento);
                if (elemento.style.display !== "none") {
                    let num = elemento.querySelector(".numRow");
                    num.innerText = cont;
                    cont += 1;
                }
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

    static anadirAlContenedorTabla(anime) {
        if (anime) {
            let contenedor = document.getElementById("contenedor");
            let listado = document.getElementById("listado");
            let tbody = document.querySelector("#listado > tbody");
            if (!listado) {
                listado = document.createElement("table");
                listado.id = "listado";
                let cabecera = document.createElement("tr");
                let num = document.createElement("th");
                num.innerText = "Num.";
                let nombre = document.createElement("th");
                nombre.innerText = "Nombre";
                let tipo = document.createElement("th");
                tipo.innerText = "Tipo";
                let fecha = document.createElement("th");
                fecha.innerText = "Fecha";
                let caps = document.createElement("th");
                caps.innerText = "Capítulos";

                listado.style.border = "1px solid black";
                listado.style.textAlign = "center";
                listado.style.borderCollapse = "collapse";

                [num,nombre,tipo,fecha,caps].forEach(el => {
                    el.style.border = "1px solid black";
                    el.style.borderCollapse = "collapse";
                    cabecera.appendChild(el);
                });
                listado.appendChild(cabecera);

                tbody = document.createElement("tbody");
                listado.appendChild(tbody);
                contenedor.appendChild(listado);
            }
            let fila = document.createElement("tr");
            fila.style.border = "1px solid black";
            fila.style.borderCollapse = "collapse";

            let num = document.createElement("td");           
            num.classList.add("numRow"); 

            let nombre = document.createElement("td");
            let enlaceElemento = document.createElement("a");
            enlaceElemento.href = anime.url;
            enlaceElemento.target = "_blank";
            enlaceElemento.innerText = `${anime.title}`;
            nombre.appendChild(enlaceElemento);

            let tipo = document.createElement("td");
            let tipoStr = anime.type ? `${anime.type}` : "Desconocido";
            tipo.innerText = tipoStr;
            
            
            let cadenaFecha = anime.aired?.from ?? "";
            let ano = anime.aired?.prop?.from?.year ?? "";
            let mes = anime.aired?.prop?.from?.month ?? "";
            if (mes !== "") {
                mes = `${mes}`.padStart(2, "0");
            }
            let cadenaMesAno = (ano && mes) ? `${mes}/${ano}` : `${(ano ? ano : "")}`;
            
            let fecha = document.createElement("td");
            fecha.innerText = cadenaMesAno;
            
            let caps = document.createElement("td");
            caps.innerText = anime.episodes ? `${anime.episodes}` : ""; 
            caps.classList.add("numCaps");

            fila.dataset.fecha = cadenaFecha;
            fila.dataset.malId = anime.mal_id;
    
            [num, nombre, tipo, fecha, caps].forEach(el => {
                fila.appendChild(el);
                el.style.border = "1px solid black";
                el.style.borderCollapse = "collapse";
            });
            tbody.appendChild(fila);
            Utilidades.ordenarListadoTabla();
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
                    [...document.querySelectorAll("#listado > tbody > tr")]
                    .filter(item => valores.includes(item.dataset.malId))
                    .forEach(elem => elem.style.display = "table-row");
                } else {
                    [...document.querySelectorAll("#listado > tbody > tr")]
                    .filter(item => valores.includes(item.dataset.malId))
                    .forEach(elem => elem.style.display = "none");
                }
                Utilidades.ordenarListadoTabla();
            });
        });
    }

    static calcularCapsTotales() {
        let total = 0;
        let tdCaps = document.querySelectorAll("#listado > tbody  > tr > td.numCaps");
        [...tdCaps].forEach(el => {
            let caps = Number.parseInt(el.innerText);
            if (caps && !isNaN(caps)) {
                total += caps;
            }
        });
        return total;
    }

    static dibujarCapsTotales() {
        let contenedorCaps = document.querySelector("#capsTotales");
        let caps = Utilidades.calcularCapsTotales();
        contenedorCaps.innerHTML = `<b>Capítulos totales:</b>  ${caps}`;
    }
}