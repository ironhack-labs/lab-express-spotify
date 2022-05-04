require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// register Partials
hbs.registerPartials(__dirname+'/views/patials');


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
app.get('/', (req,res) => {
    res.render("home");
});

app.get('/artist-search', (req,res) => {

    const {q} = req.query;
    spotifyApi
    .searchArtists(q)
    .then (data => {
      //  console.log('The received data from the API:',data.body.artists)
       const dataArtists = data.body.artists.items
       console.log(dataArtists)
        res.render("artist-search-results",{dataArtists});
    })
    .catch(err => console.log('The error while searching artists occurred:',err));

});

app.get('/albums/:id', async (req,res) => {

    try {
        const { id } = req.params
        console.log('id:'+id);
        console.log('params:'+req.params);
        spotifyApi
        .getArtistAlbums(id)    
        .then (data => {
            const dataAlbums = data.body.items;
            console.log(dataAlbums);

            res.render('albums', {dataAlbums});
        })

       

    } catch(error) {
        console.error(error);
    }

   
       

})

app.get('/album/tracks/:id', async (req,res) => {
    try {
        const { id } = req.params
        console.log('id:'+id);
        console.log('params:'+req.params);
        spotifyApi
        .getAlbumTracks(id)    
        .then (data => {
            const dataAlbumTracks = data.body.items;
            console.log(dataAlbumTracks);

            res.render('album-tracks', {dataAlbumTracks});
        })      

    } catch(error) {
        console.error(error);
    }

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
