const express = require('express');
const hbs = require('hbs');
const apiSpotify = require('./Services/apiSpotify')
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '53cf15d38928468abac8157c59700804',
      clientSecret = 'a385458d662143eb977a1207d405cc18';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
    res.render('index');
   
});


app.get('/artists', (req, res, next) => {

   apiSpotify.getArtists(req.query.artist).then(data =>{
    res.render('artists',{data});
   }).catch(error =>{
    console.log(error)
   })
    

    
   
});

app.get('/albums/:artistId', (req, res, next) => {
   
  });






app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
