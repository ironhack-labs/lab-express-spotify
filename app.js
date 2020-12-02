require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res)=>{

    return res.render("artist-search")
})



app.get('/artist-search', (req, res)=>{


const { search } = req.query



  spotifyApi
  .searchArtists(search)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0].id);
    res.render('artist-search-results', {data: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));


})


app.get('/artist-album/:id', (req, res)=>{
    const { id } = req.params;

    spotifyApi
    .getArtistAlbums(id, { limit: 10, offset: 20 })
    .then((data) => {
    console.log("Album information", data.body.items);
    const albums = data.body.items;
    return res.render("artist-album", { album: albums });
    })
    .catch((err) => {
    console.error(err);
    }); 

})


app.get('/album-playlist/:id', (req, res)=>{
    const { id } = req.params;

    spotifyApi.getAlbumTracks(id , { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    res.render('album-playlist', {data: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})
// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
