require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

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

// Render search form on root directory

app.get('/', (req, res, next) => {
    res.render ('home');  
});

//After search submission, call api and return results

app.get('/artist-search', (req, res, next) => {
    console.log(req.query.artistSearch)                                              //<- REMOVE LATER
    spotifyApi
    .searchArtists(req.query.artistSearch)
    .then(artistSearchResults => {
        let artistResultsArray = artistSearchResults.body.artists.items.map(element => {
            let properties = {
              "artistName": element.name,
              "artistId": element.id,
              "artistImage": element.images[0]
            }
            return properties;
          })
        // console.log(artistResultsArray);                                           // <-- REMOVE LATER
        res.render('artist-search-results', { artistResultsArray});                                                
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

//After choosing "VIEW ALBUMS" -> CALL API with artistID, send results to 

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params
    console.log(artistId)
    spotifyApi
    .getArtistAlbums(artistId)
    .then(albumSearchResults => {
        let albumResultsArray = albumSearchResults.body.items.map(element => {
            let properties = {
              "albumName": element.name,
              "albumId": element.id,
              "albumImage": element.images[0]
            }
            return properties;
          })
        console.log(albumResultsArray);                                       
        res.render('albums', { albumResultsArray });                                                
    })
    .catch(err => console.log('The error while searching albums: ', err));                                                         
});

// After choosing "View Tracks", call API and return track results.

app.get('/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params
    spotifyApi
    .getAlbumTracks(albumId)
    .then(trackSearchResults => {
        console.log(trackSearchResults.body.items)
        let trackResultsArray = trackSearchResults.body.items.map(element => {
            let properties = {
              "trackName": element.name,
              "trackPreview": element.preview_url,
            }
            return properties;
          })
        console.log(trackResultsArray);  
        res.render('tracks', { trackResultsArray });                                             
                                                     
    })
    .catch(err => console.log('The error while searching album tracks: ', err));                                                         
});






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
