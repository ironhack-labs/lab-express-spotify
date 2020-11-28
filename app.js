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

//Ruta de la home
app.get('/', (req, res) => {
    res.render('index');
});
  
// Ruta del search form submitted a /artist-search
app.get("/artist-search", (req, res) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        // console.log('The received data from the API: ', data.body);
        // console.log(data.body.artists.items)
        // for (let i = 0; i < data.body.artists.items.length; i++){
        //     console.log(data.body.artists.items[i].images)
        // }
        
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {artists : data.body.artists.items})
    
  })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Ruta de artist search results

app.get('/albums/:artistId', async (req, res, next) => {
  const { artistId } = req.params;
  try {
    const promise = await spotifyApi.getArtistAlbums(artistId)
    const artistAlbumsArray = promise.body.items;
    res.render('albums', { albums: artistAlbumsArray });
  } catch(err) {
    console.log('An error while searching artist albums occurred: ', err);
  } 

  // const artistId = req.params.artistId
//     spotifyApi
//         .getArtistAlbums(artistId)
//         .then((data) => {
//           // console.log('Artist albums', data.body);
//           const albumInfo = data.body.items;
//           res.render('albums', {albums : albumInfo})
//             },
//             function(err) {
//             console.error(err);
//             }
//     );
})

app.get('/albums/:albumsId/tracks', async (req, res, next) => {
  const albumsID = req.params.albumsId;
  try {
    const data = await spotifyApi.getAlbumTracks(albumsID);
    console.log('the getAlbumTracks method returns:',data)
    console.log('the getAlbumTracks method returns:', data.body)
    const albumTracks = data.body.items;
    res.render('tracks', {tracks : albumTracks})
  } catch (error) {
    console.log('An error has occurred while looking for the tracks of the album:', error)
  }
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));