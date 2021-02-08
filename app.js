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

app.get("/artist-search", async (req,res)=>{
    const data = req.query.artist
    const datosApiRespuesta = await spotifyApi.searchArtists(data)


   //console.log(datosApiRespuesta.body.artists.items)
     console.log(datosApiRespuesta.body.artists.items)

    res.render("artistsearchresults",datosApiRespuesta.body.artists.items)

});



// SERVIDORES
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


