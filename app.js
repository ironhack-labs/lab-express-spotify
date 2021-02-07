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

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/artist-search", async (req,res)=>{
    const data = req.query.artist
    const datosApiRespuesta = await spotifyApi.searchArtists(data)
    const info = datosApiRespuesta.body.artists.items.map(e=> ({
        nombre : e.name,
        fotos : e.images[1],
        id: e.id
    }))
    res.render("artists",info)
})

app.get('/albums/:artistID' , async (req,res)=>{
    const data = req.params.artistID
    const albumes = await spotifyApi.getArtistAlbums(data)
    const info = albumes.body.items.map(e=> ({
        nombre : e.name,
        fotos : e.images[1],
        id: e.id
    }))
    console.log()
    res.render("albums", info)
})

app.get('/tracks/:tracksID' , async (req,res)=>{
    const data = req.params.tracksID
    const canciones = await spotifyApi.getAlbumTracks(data)
    const info = canciones.body.items.map(e=> ({
        nombre : e.name,
        cancion : e.preview_url
    }))
    console.log(canciones.body.items)
    res.render("tracks" , info)
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
