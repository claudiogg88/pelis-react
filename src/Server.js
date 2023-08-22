const proxyJsonp = "https://script.google.com/macros/s/AKfycbyR35Oc7k89ppAt2dkCN93VrcfjTObfEZJX3K6h4c2_-T9GlZaSqjEa4H594ZSom-2j/exec";
const $ = require("jquery");
var busquedaActual = null;
const peliculasEncontradas = {};

async function FiltrarPeliculas(conf)
{
    let lista = getPeliculasLista();
    console.log(lista);
    return {Peliculas: lista, Total: lista.length}
}

async function PedirPeliculas(conf)
{
    busquedaActual = {};

    let url = "https://www.imdb.com/search/title/?";

    if (conf.filterModel.Titulo)
    {
        url += "&title=" + conf.filterModel.Titulo;
    }
    busquedaActual.Url = url;



    let response = await fetchProxy(url);
    let html = await response.text();
    let $data = $(html);

    parsearBusquedaActual($data);
    let lista = getPeliculasLista();
    console.log(lista);
    return {Peliculas: lista, Total: lista.length}
}

function getPeliculasLista()
{
    let lista = [];
    for (let id in peliculasEncontradas)
    {
        lista.push(peliculasEncontradas[id]);
    }
    return lista

}

async function fetchProxy(url)
{
    console.log(url);

    let urlEnc = encodeURI(url).replace(/&/g, "%26");
    let urlFinal = proxyJsonp + "?url=" + urlEnc;
    let response = await fetch(urlFinal);
    return response;
}

function parsearBusquedaActual($data)
{
    console.log("Analizando pagina " + busquedaActual.Pagina + " de " + busquedaActual.TotalPaginas + "...");

    let html = $data.find(".lister-item").html();

    if (html && html.indexOf("No results") != -1)
    {
        console.log("La busqueda actual no produjo resultados ");
        return false;
    }

    let $items = $data.find(".lister-item");
    let totalPagina = $data.find(".lister-item").length;
    let i = 0;

    for (i = 0; i < totalPagina; i++)
    {
        let $fila = $items.eq(i);
        parsearListadoPeliculasIMDB($fila);
    }


}


function parsearListadoPeliculasIMDB($fila)
{

    let pelicula = null;
    let imdb = $fila.find(".ribbonize").data("tconst").trim();

    //esta en la lista del cliente
    if (peliculasEncontradas[imdb])
    {
        pelicula = peliculasEncontradas[imdb];
    }
    else
    {
        //generamos la pelicula vacia
        pelicula = fabricarPelicula(imdb);
        peliculasEncontradas[imdb] = pelicula;
    }

    pelicula.Calificacion = $fila.find(".inline-block.ratings-imdb-rating").data("value");
    pelicula.TituloOriginal = $fila.find(".lister-item-header > a").text();

    let parteAnio = $fila.find(".lister-item-year").text();
    let inicioAnio = parteAnio.lastIndexOf("(");
    let finAnio = parteAnio.lastIndexOf(")");
    pelicula.Anio = parteAnio.substring(inicioAnio + 1, finAnio);
    pelicula.Sinopsis = $fila.find(".text-muted").eq(2).text().trim();
    pelicula.Metascore = $fila.find(".metascore").text().trim();

    let $votosYPlata = $fila.find("[name='nv']");
    for (let i in $votosYPlata)
    {
        let elem = $votosYPlata.eq(i);
        let texto = elem.text();
        let dataValue = elem.data("value");
        if (!dataValue)
        {
            continue;
        }
        if (texto.indexOf("$") != -1)
        {
            pelicula.Recaudacion = dataValue.toString().replace(/,/g, "");
        }
        else
        {
            pelicula.Votos = dataValue.toString().replace(/,/g, "");
        }
    }

    if (pelicula.Sinopsis.trim().indexOf("Add a Plot") != -1)
    {
        pelicula.Sinopsis = null;
    }


    pelicula.Duracion = $fila.find(".runtime").text().replace("min", "").trim();
    pelicula.Generos = [];
    $fila.find(".genre").text().trim().split(",").forEach(function (value)
    {

        let texto = value.trim();
        if (texto && texto != "|")
        {
            pelicula.Generos.push(texto);
        }
    });

    let personas = $fila.find("p").eq(2).find("a");
    pelicula.Director = [];
    pelicula.Reparto = [];
    for (let i in personas)
    {
        let item = personas.eq(i);

        let urlPersona = item.attr("href");
        if (urlPersona)
        {

            let final = null;
            let rolId = null;
            let nombre = item.text().trim();
            let urlPersonaCorta = urlPersona.replace("/name/", "");
            final = urlPersonaCorta.indexOf("/?ref_=adv");
            if (final != -1)
            {
                rolId = urlPersonaCorta.substring(0, final);
            }


            if (urlPersona.indexOf("_st_") != -1)
            {
                let reparto = {
                    Nombre: nombre,
                    Id: rolId
                };
                pelicula.Reparto.push(reparto);
            }
            if (urlPersona.indexOf("_dr_") != -1)
            {
                let director = {
                    Nombre: nombre,
                    Id: rolId
                };
                pelicula.Director.push(director);
            }
        }
    }

    return pelicula;


}

//parseamos el resultado de la busqueda en imdb
function fabricarPelicula(imdb)
{
    let pelicula = {};
    pelicula.IdIMDB = imdb;
    return pelicula;
}

module.exports.PedirPeliculas = PedirPeliculas;
module.exports.FiltrarPeliculas = FiltrarPeliculas;