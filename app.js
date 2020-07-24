require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const  SpotifyWebApi  =  require ( 'spotify-web-api-node' ) ;

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => {
    res.render("home");
  });
app.get("/artist-search", (req, res, next) =>{
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {artists: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        
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


// Our routes go here:
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

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
