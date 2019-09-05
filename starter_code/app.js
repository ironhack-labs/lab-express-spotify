const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '66189ab87b734466b6dfc42889e00a7d',
    clientSecret = '90f75fe58a1046deb17b8a293de8c5c6';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// the routes go here:
// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



  app.get('/', (req, res, next)=>{
    res.render('index');
  });

  app.get('/artist', (req, res, next)=>{
    spotifyApi.searchArtists(req.query.searchArtist)
        .then(data => {

        // console.log("The received data from the API: ", data.body.artists);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render("artist", {dataList: data.body.artists.items});
        // res.render("albums", {albumDataList: data.body.artists.items});
        })
        .catch(err => {
        console.log("The error while searching artists occurred: ", err);
        })
});


app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log("The received data from the API:", data.body.items);
            res.render("albums", {albumList: data.body.items});
            })
        .catch(err => {
            console.log("Error while searching artists occurred: ", err);
        })
  });

  app.get('/tracks/:albumId', (req, res, next) =>{
    spotifyApi.getAlbumTracks(req.params.albumId)
      .then(data => {
        console.log("Tracks listed", data.body.items);
        res.render("tracks", {trackList: data.body.items});
      })
      .catch(error => {
        console.log("Error while listing tracks", error);
      })
  });

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
