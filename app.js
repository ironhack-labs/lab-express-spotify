require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + "/views/partials");

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //insert data when you have it
    clientSecret: process.env.CLIENT_SECRET //insert data when you have it
  });
   
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:

    app.get("/", (req, res, next) => res.render("index"));

    app.get('/artist-search', (req, res, next) => {
        spotifyApi
            .searchArtists(req.query.artist)
            .then(data => {
                //console.log('The received data from the API: ', data.body);
                 
                let result = {}
                result = data.body.artists.items
                res.render("artist-search-results",  {result});
            })
            .catch(err => console.log('The error while searching artists occurred: ', err));
      });
    
    app.get('/albums/:artistId', (req, res, next) => {
        spotifyApi
            .getArtistAlbums(req.params.artistId)
            .then(data => {
                //console.log('The received data from the API: ', data.body);
                let albumsResult = {}
                albumResult = data.body.items
                //console.log(albumResult)
                res.render("albums", {albumResult});
                
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
        
    /*app.get('/tracks/', (req, res, next) => {
        spotifyApi
            .getArtistAlbums(req.params.artistId)
            .then(data => {
                console.log('The received data from the API: ', data.body);
                    let albumsResult = {}
                    albumResult = data.body.items
                    //console.log(albumResult)
                    res.render("albums", {albumResult});
                    
            })
            .catch(err => console.log('The error while searching artists occurred: ', err));       
        */
});
      



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
