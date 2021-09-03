require('dotenv').config();


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Our routes go here:
app.get("/", (req, res, next) => {
    res.render("index")
})

app.get('/artist-search', (req, res) => {
    console.log('hola' , req.query.artist)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render("artist-search-results", {data: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err)); 
  
});


app.get('/albums/:artistId', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('Holiiii' , data);
            //res.send(data)//ver el objeto de elementos
             res.render("albums", {data: data.body.items})
            })
        .catch(err => console.log('The error while searching artists occurred: ', err)); 
  });
                                                                                                  

app.get('/tracks/:albumsId', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.albumsId)
        .then(data => {
           // res.send("HALLO", data.body);//ver el objeto de elementos
            res.render("tracks", {data: data.body.items})
            })
        .catch(err => console.log('The error while searching artists occurred: ', err)); 
  });





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
