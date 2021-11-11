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
app.get("/", (req, res, next) => {
    res.render("artist-search");
 });

 app.get("/artist-search-results", (req, res, next) => {
     const {artist} = req.query;
     
    spotifyApi 
  .searchArtists (artist) 
  .then ( data  =>  { 
    console.log ( 'Los datos recibidos de la API:' ,  data.body ); 
    // ----> 'AQUÍ LO QUE QUEREMOS HACER DESPUÉS DE RECIBIR LOS DATOS DE LA API' 
    // ---->para ver el object que nos devuelvea la url
     //res.send(data)
     res.render("artist-search-results", {artists: data.body.artists.items} );
  } ) 
  .catch ( err  =>  console.log ( 'Se produjo el error al buscar artistas:' ,  err ) ) ;
   
 });

 app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const {artistId} = req.params
  console.log(req.params);
  spotifyApi
  .getArtistAlbums(artistId)
  .then( data => {
      // console.log('Artist albums', data.body.items);
      //res.send(data.body.items)
      res.render("albums", {albums: data.body.items} );
  })
  .catch ( err  =>  console.log ( 'Se produjo el error al buscar artistas:' ,  err ) ) ;
});



app.get('/viewTracks/:albumId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const {albumId} = req.params
  console.log(req.params);
  spotifyApi
  .getAlbumTracks(albumId)
  .then( data => {
      // console.log('Artist albums', data.body.items);
      //res.send(data.body.items)
      res.render("viewTracks", {viewTracks: data.body.items} );
  })
  .catch ( err  =>  console.log ( 'Se produjo el error al buscar artistas:' ,  err ) ) ;
});
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
