require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', function (req, res) {
 // console.log(req);
  //res.send(req.query);
  res.render("index");
  //res.send(req.params.username);
})
/*app.get('/artists', function (req, res){
  console.log(req);
  //res.send(req.query);
  res.send(req.query);
  //res.send(req.params.username);
})*/

//Query artists
app.get('/artists', (req, res) =>{
  //console.log (req.query.artist);
spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
   console.log('The received data from the API: ', data.body);
    //res.send(data.body);
  const queryResult = data.body.artists.items;
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists',{queryResult});
    
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);})
  })

app.get('/albums/:artistId', (req, res, next) => {
      //console.log (req.query.artist);
spotifyApi
.getArtistAlbums(req.params.artistId)
.then(data => {
 console.log('The received data from the API: ', data.body);
  //res.send(data.body);
const queryResult = data.body.items;
  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  res.render('albums',{queryResult});
})
.catch(err => {
  console.log('The error while searching artists occurred: ', err);})
})

//get Album Tracks
app.get('/tracks/:albumId', (req, res, next) => {
  //console.log (req.query.artist);
spotifyApi.
getAlbumTracks(req.params.albumId)

  .then(data=> {
    const queryResult = data.body.items;
    console.log("Anzahl Tracks" +data.body.items.length);
    res.render('tracks',{queryResult});
  })
  .catch (err=> {
    console.log('Something went wrong!', err);
  });
})


app.listen(3000, () =>{
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
});
