const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');




const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '94a50576dd9a4808b744f40c41d1536d',
    clientSecret = '04b8780d38f6431a89bd57a874f786e4';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next)=>{
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    console.log(req.query.artist);
    let singleImage = data.body.artists.items.images;
    // console.log("------------", singleImage);
    

    // console.log("The received data from the API: ", data.body.artists.items[0].images[0].url);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', {data});
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
  
  // res.send(req.query);
})

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let theID = req.params.artistId;
  spotifyApi.getArtistAlbums(theID)
  .then((data)=>{
    console.log(data.body.items[0].artists[0].name);
    // console.log('Artist albums', data.body[0]);
    res.render('albums', {data});
  })
  .catch(err => {
    console.log("The error while searching artist albums occurred: ", err);
  })
});

app.get('/tracks/:albumId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let theID = req.params.albumId;
  spotifyApi.getAlbumTracks(theID)
  .then((data)=>{
    console.log(data.body.items);
    // console.log('Artist albums', data.body[0]);
    res.render('tracks', {data});
  })
  .catch(err => {
    console.log("The error while searching artist albums occurred: ", err);
  })
});




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
