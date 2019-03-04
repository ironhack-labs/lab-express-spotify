const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:

const clientId = 'ca9d3792e0d3475dabdc4e859ebf43ce',
    clientSecret = '9a490b40b3db49a99c0d775078cf0de7';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    console.log(data)
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index')
  
})
app.get("/artist", (req, res) => {

  spotifyApi.searchArtists(req.query.artist)
  .then(artistObj => {
    
    //console.log(artistObj.body.artists.items)
    
    res.render('artist',  {artistObj: artistObj.body.artists.items})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})

app.get("/albums/:albumid", (req, res) => {

  console.log(req.params.albumid)
  spotifyApi.getArtistAlbums(req.params.albumid)
  .then(albumObj => {
    console.log(albumObj.body.items)
    res.render('albums', {albumObj: albumObj.body.items})
  })
  .catch(err => console.log(err))

})

app.get("/tracks/:trackid", (req, res) => {
spotifyApi.getAlbumTracks(req.params.trackid)
.then(trackObj => {
  console.log(trackObj.body)
  res.render('tracks', {trackObj: trackObj.body.items})
})
.catch(err => console.log(err))
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
