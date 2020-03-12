require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path')
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public/'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  

hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.get('/', (req,res,next) => res.render('index'));

app.get('/artist-search', (req, res, next) => {
    console.log(req.query.artist)
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {

    let spotiArtist = data.body.artists.items
   //console.log('The received data from the API: ', {spotiArtist});
    //console.log(spotiArtist[0].artistid--undefined)
    res.render('artist-search-results', {spotiArtist})
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));    

});

app.get('/albums/:id', (req, res, next) => {
   
    spotifyApi
    .getArtistAlbums(req.params.id) 
    .then(data => {
       // console.log(data)
        let spotiAlbum = data.body.items
        
       // console.log('The received data from the API: ', {spotiAlbum});
       //console.log(spotiAlbum[0].images[0].url)
        res.render('albums', {spotiAlbum} )

    })
    .catch(err => console.log(`You made a mistake ${err} `))

  });



  app.get('/tracks/:id', (req, res, next) => { 
  
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then (data => { 
    console.log(data)

    let spotiTrack = data.body.items
    console.log({spotiTrack})
    res.render('tracks', {spotiTrack})
  
  })

  .catch(err => console.log(`you made a mistake ${err}`))

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
