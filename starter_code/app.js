const express = require('express');
const hbs = require('hbs');
require('dotenv').config();
var bodyParser = require('body-parser')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'));



// Remember to insert your credentials here

const clientId = process.env.IdCliente;
   const  clientSecret = process.env.SecretId;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

//****************************/





// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })

// ***************** Index *****************/


app.get("/", (req, res) =>{
      res.render("index"); });


//************** Artists ******************/


app.post("/artists", (req, res) =>{
var data = req.body.search
spotifyApi.searchArtists(data)

.then(respuesta => {
   console.log(respuesta.body.artists.items[0].images);
    res.render("artists", {artists: respuesta.body.artists.items})
})     .catch(err => {
    console.log("The error while searching artists occurred: ", err);
     })
               });

//************ Songs **************/
app.get("/songs/:idAlbum", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.idAlbum)
        .then(data => {
            res.render("songs", { songs: data.body.items });
        })
        .catch(err => {
            console.log('Song not found Error:', err);
        })
});


//************ ALBUMS **************/
app.get("/albums/:idArtist", (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.idArtist)
    .then(data=>{
        // res.json(data)
        res.render("albums",{ albums:data.body.items })
    })
    .catch(err=>{
        console.log('Artist not found Error', err);
    
    })
});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
