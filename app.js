require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', async(req, res, next)=>{
     
     try {
        const response = await spotifyApi.searchArtists(req.query.name);

        const artistsRes=response.body.artists.items;

        console.log(artistsRes[0].id);

        res.status(200).render('artist-dashboard',{artistsRes});
    
      } catch (error) {
        res.status(500).send({
          message: 'The error while searching artists occurred:'+ error
        });
      }

});

app.get('/albums/:id', async(req,res,next)=>{
   
    try {
        const response1 = await spotifyApi.getArtistAlbums(req.params.id);

        const albums= response1.body.items;

        res.status(200).render('albums',{albums});

        // console.log('SECOOOOOOOOND', response1.body.items);

    } catch (error) {
        res.status(500).send({
            message: 'The error while searching albums occurred:'+ error
          }); 
    }
});

app.get('/tracks/:id', async(req,res,next)=>{
   
    try {
        const response2 = await spotifyApi.getAlbumTracks(req.params.id);

        const tracks =response2.body.items;

        console.log('TREEEEEESSSSSS', response2.body.items[0].name);

        res.status(200).render('tracks',{tracks});

    } catch (error) {
        res.status(500).send({
            message: 'The error while searching tracks occurred:'+ error
          }); 
    }
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
