//1. IMPORTACIONES

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
//const bodyParser =require('body-parser')


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

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

/*const middlewarePersonalizado = (req,res,next) =>{
    console.log("Hola, soy el cadenero")
    next()
}

const middlewarePersonalizadoVIP = (req,res,next) =>{
    console.log("Hola, soy el cadenero VIP")
}
*/

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

    const extractedInfo = await datosApiRespuesta.body.artists.items.map((elem)=>({
        name: elem.name,
        image: elem.images[0],
        id: elem.id
    }))
   console.log(datosApiRespuesta.body.artists)
    // console.log(datosApiRespuesta.body.artists.items[0].images)

    res.render("artistsearchresults",{datosApiRespuesta})

})



// SERVIDORES
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


