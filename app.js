//1. IMPORTACIONES

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//app.use(bodyParser.urlencoded({extended:true}))


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// 2. MIDDLEWARE

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// 3. RUTAS
    // Our routes go here:

    /*
    app.use(middlewarePersonalizado)
    app.use(middlewarePersonalizadoVIP)
*/
app.get ("/",(req,res,next)=>{
    res.render("home")
})

// ITERATION 2. Display results for artist search
app.get("/artist-search", async (req,res,next)=>{
    const data = req.query.artist
    const datosApiRespuesta = await spotifyApi.searchArtists(data)

//    console.log("mi respuesta es")
  // console.log(datosApiRespuesta.body.artists.items)

    res.render("artistsearchresults",datosApiRespuesta.body.artists.items)

});

//Iteration 4: view albums

app.get("/albums/:artistId",async(req,res,next)=>{
    const idAlbum = req.params.artistId;
    const spotifyAlbum = await spotifyApi.getArtistAlbums(idAlbum);
    console.log("la respuesta es")
    console.log(spotifyAlbum.body.items)
    res.render('albums',spotifyAlbum.body.items)
})

// SERVIDORES
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


