require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node")
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
   clentId: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,

})
spotifyApi
.clientCredentialsGrant()
.then((data)=> spotifyApi.setAcccesToken(data.body["access_token"]))
.catch((error) =>
console.log("somethin went wrong when retrieving an acces token", error))

// Our routes go here:
app.get('/', (req, res, next) =>{

        res.render("home")
    })


app.get('/artist-search-results', (req, res, next) =>{
    spotifyApi
    .searchArtists(req.query.artist)
    .then((data)=>{
        res.render("artist-serch-results",{
            artists: data.body.artists.items
        })
       console.log("The received data from the API:", data.body); 
    })
    .catch((err)=> console.log("the error while searching artists occured: ", err))
} )


app.get("/albums/:id", (req, res, next)=>{
    spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data)=>{
        res.render("albums", {
           albums: data.body.items,
     })
   })
   .catch((err)=>
   console.log("The error while searching albums occurred: ", err))
})

app.get("/tracks/:id", (req, res, next) =>{
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data)=>{
        res.render("tracks",{ 
        tracks: data.body.items
    })
})
.catch((err) => console.log("The error while searching tracks occured: ", err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
