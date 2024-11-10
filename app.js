require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get('/', (req, res, next) =>{
    res.render('home')
    })

app.get('/artist-search-results', (req,res,next) =>{
    const { q: searchTerm } = req.query;
        spotifyApi
        .searchArtists( searchTerm, {limit:10} ) 
        .then ( function ( data )  { 
          //console.log ( 'Información de los artistas' , data.body.artists.items[0].images[0] ) ; 
          res.render('artist-search-results', { artists: data.body.artists.items })
        } ,function(err) { 
          console.error(err) ; 
        } ) ;
    })
app.get('/albums/:artistId', (req, res, next) => {
        const {artistId} = req.params
        spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
           // console.log(data.body.items);
            res.render("albums", {albums :  data.body.items})
          }, function(err) {
            console.error(err);
          });
});


app.get('/tracks/:id',(req,res,next)=> {
    const {id} = req.params
    spotifyApi
    .getAlbumTracks((id) ) 
    .then( data =>  { 
    console.log( data.body.items)
    res.render("tracks", {track :  data.body.items})
  } ,function(err){ 
    console.log( '¡Algo salió mal!',err) ; 
  } ) ;
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
