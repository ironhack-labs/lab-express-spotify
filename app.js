require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const exphbs = require('express-handlebars');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

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
    res.sendFile(__dirname + '/views/layout.hbs');
});


//Artist search route
app.get('/artist-search',(req, res)=>{
    const artistQuery = req.query.artist;

    spotifyApi
        .searchArtists(artistQuery)
        .then(data =>{
            const artists = data.body.artist.items;
            res.render('artist-search-results', { artists});
        })
    .catch(err => {
        console.log('The error while searching artists occurred ', err);
    })
    res.sendStatus(500);
    res.json(results);
});


//Albums Route
app.get('/albums/:artistsId', (req,res,next)=> {
    const artistsId = req.params.artistsId;

    spotifyApi.getArtistAlbums(artistsId)
    .then(data =>{
        const albums = data.body.items;
        res.render('albums', {albums});
    })
    .catch(err => {
        console.log ('Error getting artist albums:', err);
        res.sendStatus(500);
    })
})

//Tracks route

app.get ('tracks/:albumId',(req,res,next) =>{
    const albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        const tracks = data.body.items;
        res.render('tracks', {tracks});
    })
    .catch(err => {
        console.log('Error getting album tracks:', err);
    });
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
