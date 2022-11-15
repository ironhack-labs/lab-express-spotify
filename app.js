require("dotenv").config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require ('spotify-web-api-node');



// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then((data) => {
    // console.log(data);
    spotifyApi.setAccessToken(data.body.access_token)
})
.catch((error) => 
console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
    });
    

    app.get('/artist-search', (req, res) => {
        // console.log(req.query.theArtistName, "helloooo");
        // const searchArtist = req.query.theArtistName;
        spotifyApi
        .searchArtists(req.query.theArtistName)
        .then((data) => {
        //   console.log('The received data from the API: ', data.body.artists.items);
        // console.log("DATA", data)
        res.render('artist-search-results', {artists: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    });   


    app.get("/albums/:artistId", (req, res) => {
        // console.log(req.params.artistId, "WATCHA")
        spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
            res.render("albums", {
                albums: data.body.items,
            });
            // console.log(
            //   'The received data from the API: ', 
            //   data.artists.name
            // )
        })
        .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
      });

    
      app.get('/tracks/:albumId', (req, res) => {
        spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then((data) => {
            res.render("tracks", {tracks: data.body.items});
            //   console.log('The received data from the API: ', data.body.items);
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));res.render('track.hbs');
      });

    
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
