require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    app.get('/', function(req, res) {
        res.render('index.hbs');
    });

    app.get('/artist-search', function(req, res) {
        spotifyApi
        .searchArtists(req.query.q)
        .then(data => {
            const searchedArtist = data.body.artists.items
            console.log('The received data from the API: ', searchedArtist)
            res.render('artist-search', { searchedArtist } )
        
             })
  .     catch(err => console.log('The error while searching artists occurred: ', err));
     })

     app.get("/albums/:artistId", (req, res) => {
        const id = req.params.artistId;
        console.log(id);
      
        spotifyApi
          .getArtistAlbums(id)
          .then((data) => {
            console.log(data.body.items);
            const albums = data.body.items;
            res.render("albums", { albums });
          })
          .catch((err) => console.log("OH NO! ERROR FETCHING ALBUMS", err));
      });

      app.get("/tracks/:trackId", (req, res) => {
        const id = req.params.trackId;
        console.log(id);
        // Get tracks in an album
        spotifyApi
          .getAlbumTracks(id)
          .then((data) => {
            console.log("TRACKS DATA IS HERE");
            console.log(data.body.items);
            const tracks = data.body.items;
            tracks.forEach((track) => console.log(track.name));
            // res.send("getting tracks");
            res.render("tracks", { tracks });
          })
          .catch((err) => console.log(err));
      });
   
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
