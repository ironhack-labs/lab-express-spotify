require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


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

app.get('/', (req, res)=> {
    res.render('homepage')
})


app.get('/artist-search',  (req, res) => {
    const queryString = req.query.q
    
    spotifyApi
    .searchArtists(queryString)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      const filteredArtist = data.body.artists.items.filter(artist => {
        	return (artist.name.toLowerCase().includes(queryString.toLowerCase()))
        })
      res.render('artist-search-results', {filteredArtist})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    const paramsString = req.params.artistId
spotifyApi
.getArtistAlbums(paramsString)
.then((data) => { 
    // console.log('Artist albums', data.body)
    const albumDetails = data.body.items
    res.render('albums', {albumDetails})
})  
    .catch(err => console.log('The error while searching artists occurred: ', err));
}) 


app.get('/tracks/:tracksID', (req, res)=> {
    const tracks = req.params.tracksID
    spotifyApi
    .getAlbumTracks(tracks)
    .then ((data) => { 
        const trackDetail = data.body.items
        res.render('tracks', {trackDetail})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})



// app.get('/albums/:albumId', (req, res) => {
//     spotifyApi
//     .getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE') 
//     .then(data => { console.log('Artist albums', data.body.album);},
//         function(err) {
//           console.error(err);
//         }
//       );
// })
 





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
