// nos permite acceder a las variables de entorno (cosas que no queremos mostrar)
require('dotenv').config();
// requerimos express.
const express = require('express');
// requerimos handlebars.
const hbs = require('hbs');
// requerimos spotify-web-api-node.
const SpotifyWebApi = require('spotify-web-api-node');

// ejecutamos express. 
const app = express();

// establecemos que lo vamos a ver a traves de handlebars.
app.set('view engine', 'hbs');
// establecemos la raíz de nuestra carpeta. 
app.set('views', __dirname + '/views');
// establecemos la carpeta de archivos estaticos. 
app.use(express.static(__dirname + '/public'));

// la configuracion de la spotify-api.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// recuperamos el acceso al token. 
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// creamos la ruta al index/homepage (archivo que se llama home.hbs)
app.get("/", (req, res, next) => {
    // si todo sale bien renderiza la pagina home.hbs
    // el home hace referencia al archivo
    res.render("home")
});

// creamos la ruta de la pagina de artistas (archivo que se llama artist-search-results).
app.get("/artist-search", (req, res, next) => {
    spotifyApi
    // para buscar los discos usamos el metodo de la api 'searchArtist'. traemos el objeto query que esta dentro del objeto req. luego le indicamos donde lo queremos meter, que es en artistName.
    // traeme lo que se escriba en el input (search bar) 
    // en este caso, esta ruta va a ser activada con el url, por ej: www.ejemplo.com/artist-search y luego viene la query (string dinamica) 
    //                                             esto se ve asi:  www.ejemplo.com/artist-search?artistName=shakira
    // la query es una lista de datos que consiste de pares de clave=valor empieza con el ? y luego clave=valor. 
    .searchArtists(req.query.artistName)
    // si todo sale bien, se ejecutara el then. si hay error ira al catch de abajo.
    // data es todo lo que me devuelve el resultado de la busqueda. 
    .then(data => {
        // si todo se ejecuta bien nos muestra el console.log
        console.log('The received data from the API: ', data.body.artists.items);
        // si todo sale bien renderiza la pagina artists-search-results.hbs
        res.render(
            // el artist-search-results hace referencia al archivo. 
            'artist-search-results', {
                // el objeto que pasamos a la vista, esta ruta es según lo requiere la api por como esta organizada la info.
                artists: data.body.artists.items
            }
        )
    })
    // si ocurre un error, nos muestra este mensaje.
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// creamos la ruta de la pagina de los discos (archivo albums.hbs).
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    // para buscar los discos usamos el metodo de la api 'getArtistsAlbums'. 
    // traemos el objeto query que esta dentro del objeto req. luego le indicamos donde lo queremos meter, que es en artistId.
    // en este caso, esta ruta va a ser activada con el url, por ej: www.ejemplo.com/album/:artistID y luego viene la query (string dinamica) 
    //                                             esto se ve asi:  www.ejemplo.com/album/:artistID?artistId=887548
    // la query es una lista de datos que consiste de pares de clave=valor empieza con el ? y luego clave=valor. 
    .getArtistAlbums(req.params.artistId)
    // si todo sale bien, se ejecutara el then. si hay error ira al catch de abajo.
    // data es todo lo que me devuelve el resultado de la busqueda. 
    .then(data => {
        // si todo se ejecuta bien nos muestra el console.log
        console.log('The received data from the API: ', req.params.artistId)
        // si todo sale bien renderiza la pagina albums.hbs
        res.render(
            // el albums hace referencia al archivo. 
            'albums', {
                // el objeto que pasamos a la vista, esta ruta es según lo requiere la api por como esta organizada la info.
                albums: data.body.items
            }
        )
    })
    // si ocurre un error, nos muestra este mensaje.
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });


// creamos la ruta de la pagina de los discos (archivo albums.hbs).
app.get('/tracks/:artistId', (req, res, next) => {
    spotifyApi
    // para buscar los discos usamos el metodo de la api 'getAlbumTracks'. 
    // traemos el objeto query que esta dentro del objeto req. luego le indicamos donde lo queremos meter, que es en artistId.
    // en este caso, esta ruta va a ser activada con el url, por ej: www.ejemplo.com/tracks/:artistID  y luego viene la query (string dinamica) 
    //                                             esto se ve asi:  www.ejemplo.com/tracks/:artistID?artistId=887548
    // la query es una lista de datos que consiste de pares de clave=valor empieza con el ? y luego clave=valor. 
    .getAlbumTracks(req.params.artistId)
    // si todo sale bien, se ejecutara el then. si hay error ira al catch de abajo.
    // data es todo lo que me devuelve el resultado de la busqueda. 
    .then(data => {
        // si todo sale bien renderiza la pagina tracks.hbs
        res.render(
            // el tracks hace referencia al archivo. 
            'tracks', {
                // el objeto que pasamos a la vista, esta ruta es según lo requiere la api por como esta organizada la info.
                tracks: data.body.items
            }
        )
    })
    // si ocurre un error, nos muestra este mensaje.
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// establecemos el puerto, que es el numero 3000.
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
