require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:y
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: '03eebae21d5b452487b397f226f83b76',
    clientSecret: '7b4f54faa90741c3ba065dad0d87abcb'
});
  
// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then((data) =>
    spotifyApi.setAccessToken(data.body['access_token']))
.catch((error) => 
    console.log('Something went wrong when retrieving an access token')
);

// Our routes go here
app.get("/", (req, res, next) => {
    res.render("home");
  });

app.get("/artist-search", (req, res, next) =>{
    //recebe parametros através da query
    const { artist } = req.query;
    
    //petiçao para a api do spotify passando a query "artista"
    spotifyApi
    .searchArtists(artist)
    .then(data => {
        //resposta da petiçao 
        const artistsList = data.body.artists.items;
        //renderiza a pagina de artist-search-results.hbs e passa a lista de artistas
        res.render("artist-search-results", { artistsList } )
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res, next) => {
    const id = req.params.id;

    spotifyApi
    .getArtistAlbums(id)
    .then(data => {
        const albums = data.body.items
                //albums.hbs  //variavel albums (const = albums)
        res.render('albums', { albums })
    })
    .catch(err => {
        console.error(err);
    })
});

app.get("/tracks/:id", (req, res, next) => {
    const id = req.params.id

    spotifyApi
    .getAlbumTracks(id, { limit : 10, offset : 1 })
    .then(function(data) {
        const tracks = data.body.items
        res.render("track", { tracks })
    }, function(err) {
        console.log('Something went wrong!', err);
    });

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
