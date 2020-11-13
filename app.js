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
//Iteration 1 - Set up index
app.get('/', (req,res) => {
    res.render('index', )
})

//Iteration 2 - display search results
// name="artist"

app.get('/artist-search', (req,res) => { 
    const artist = req.query.artist.toLowerCase()
    spotifyApi
    // const searchedArtist = artist.filter(artist => artist
    //     .name
    //     .toLowerCase()
    //     .includes(req.query.name.toLowerCase())
    .searchArtists(artist)
    .then(data => {
        console.log('artists: ', data.body.artists.items);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artist-search-results', {artist : data.body.artists.items})
    })   
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

//Iteration 4 - view albums
app.get('/albums/:artistId', (req,res,next) => { 
    const artistID = req.params.artistId

    spotifyApi
    .getArtistAlbums(artistID)
    .then(data => {
        // console.log('albums: ', data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
         res.render('albums', {artistID : data.body.items})
    })   
    .catch(err => console.log('The error while fetching the albums occurred: ', err));


})

//Iteration 5 - get album tracks 
app.get('/track/:albumID', (req,res,next) => { 
    const albumID = req.params.albumID

    spotifyApi
    .getAlbumTracks(albumID)
    .then(data => {
        console.log('tracks: ', data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
         res.render('track', {albumID : data.body.items})
    })   
    .catch(err => console.log('The error while fetching the albums occurred: ', err));


})

//delete ===========
// 03wSDc4o42K7kEXijd1hpy
// 03wSDc4o42K7kEXijd1hpy

// items: [
//     {
//       album_group: 'album',
//       album_type: 'album',
//       artists: [Array],
//       available_markets: [Array],
//       external_urls: [Object],
//       href: 'https://api.spotify.com/v1/albums/03wSDc4o42K7kEXijd1hpy',
//       id: '03wSDc4o42K7kEXijd1hpy',
//       images: [Array],
//       name: 'Tell Balgeary, Balguery is Dead',
//       release_date: '2012-04-24',
//       release_date_precision: 'day',
//       total_tracks: 10,
//       type: 'album',
//       uri: 'spotify:album:03wSDc4o42K7kEXijd1hpy'
//     },


// {{!-- {
//     external_urls: {
//       spotify: 'https://open.spotify.com/artist/5hbH3dvtk49g07qpc1QwPe'
//     },
//     followers: { href: null, total: 26070 },
//     genres: [ 'alternative rock', 'indie rock' ],
//     href: 'https://api.spotify.com/v1/artists/5hbH3dvtk49g07qpc1QwPe',
//     id: '5hbH3dvtk49g07qpc1QwPe',
//     images: [ [Object], [Object], [Object] ],
//     name: 'Ted Leo and the Pharmacists',
//     popularity: 37,
//     type: 'artist',
//     uri: 'spotify:artist:5hbH3dvtk49g07qpc1QwPe'
//   } --}}

//delete above =====
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


// app.get('/onemovie', (req, res) => {
//     res.render('onemovie')
// });