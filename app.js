require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
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

//render index (cuando pongan / que les muestre el index)
app.get("/", function (req, res) {
    res.render("index");
});

//al hacer click al boton de view empezamos a buscar la información sobre los albumes de este artista
app.get("/albums/:artistId", (req, res) => {
    //aprobechamos el url que se crea y se le pasa al metodo el id como parametro
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then((data) => {
            //console.log(data.body);
            res.render("albums", {similarAlbums: data.body.items})
        })
        //siempre se tiene que poner el catch
        .catch(error => console.log('Something went wrong when retrieving an access token', error));
    }
);

//al hacer click al boton de view empezamos a buscar la información sobre los albumes de este artista
app.get("/tracks/:albumId", (req, res) => {
    //aprobechamos el url que se crea y se le pasa al metodo el id como parametro
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then((data) => {
            console.log(data);
            res.render("tracks", {listTracks: data.body.items})
        })
        //siempre se tiene que poner el catch
        .catch(error => console.log('Something went wrong when retrieving an access token', error));
    }
);

//Donde direccionamos los datos que obtenemos del /artist-search que se encuentra en el index.
app.get("/artist-search", (req, res) => {
    //creo la variable donde guardaré el dato que recogo del input
    //en el req.query.(tengo que poner lo mismo que en el name del input!!)
    const artist = req.query.artist
    //Busco el método para que me devuelva todos los artistas que tengan mi variable artist en su nombre
    spotifyApi.searchArtists(artist)
    //data se refier al paquete de info que sacamos de la api 
        .then ((data) =>  {
            //mediante el console.log vamos extrayendo poco a poco el objeto donde se encuentra la información que necesitamos
            //console.log(data.body.artists);
            //una vez que sabemos la ruta la renderizamos en la view artist donde se mostrará el resultado.
           res.render("artist", {similarArtists: data.body.artists.items}) 
        }) 
        //siempre se tiene que poner el catch
        .catch(error => console.log('Something went wrong when retrieving an access token', error));
    }

  
);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
