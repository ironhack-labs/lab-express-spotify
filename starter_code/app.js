const express = require('express');
const hbs = require('hbs');
const apiSpotify = require('./Services/apiSpotify')
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {

    res.render('home');
   
});


app.get('/artists', (req, res, next) => {

   apiSpotify.getArtists(req.query.artist).then(data =>{

    console.log(data)
    res.render('artists', { data });
   }).catch(error =>{
    console.log(error)
   })
  
});

app.get('/albums/:artistId', (req, res, next) => {

  apiSpotify.getAlbums(req.params.artistId).then(data =>{
    res.render('album', { data });
   }).catch(error =>{
    console.log(error)
   })
   
  });

  app.get('/tracks/:albumId', (req, res) => {

    apiSpotify.tracks(req.params.albumId).then(data =>{
      res.render('tracks', { data });
     }).catch(error =>{
      console.log(error)
     })
     
    });

  




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
