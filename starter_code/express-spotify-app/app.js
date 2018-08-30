const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/layouts');
app.set('view engine', 'hbs');

// Remember to paste here your credentials
var clientId = 'a69adf89d03f47a99efa75add192ee9e',
    clientSecret = '3bd0c7db48394c9eb5d6b11ceb9fff83';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Create a simple home page. You'll need a basic index route, that renders a home page.
// M:Creating the route
app.get('/', (req, res, next) => {
	res.render('home');
})

// Create the route /artists. This route will receive the search term from the query string,
//  and make a search request using the Spotify Package.

//M: Creating the route
app.get('/artists', (req, res, next) => {
  // console.log("ok");
  let queryResult = req.query.artist
  // console.log("req.query.artist: " + req.query.artist);

  spotifyApi.searchArtists(queryResult)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // console.log(data);
      // console.log(data.body.artists);
      
      // console.log(data.body.artists.items[0].name);
      // console.log(data.body.artists.items[0].images[0].url);
      
      var artists = [];
      
    
      data.body.artists.items.forEach(function(elt) {
        var obj = {};
        obj["name"] = elt.name;
      
      // console.log(elt);
      // console.log(elt.name);
      if(elt.images.length > 0) {
        obj["image"] = elt.images[0].url;
        // console.log(elt.images[0].url);
      } else {
        obj["image"] = 0
      }
      obj["artistId"] = elt.id;
      artists.push(obj);
     })

    //  console.log("artist :" + artists);
    //  console.log("artist 1: " + artists[0].name);
    //  console.log("artist 2: " + artists[1].name);
    //  console.log("artist 3: " + artists[2].artistId);
     res.render('artists.hbs', {list: artists});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.log(err);
    })
})

// Why does this work? You write artistId but it redirects to a page called album only?
app.get('/albums/:artistId', (req, res) => {


  // console.log("artistId: " + req.query.albums);
  spotifyApi.getArtistAlbums(req.query.albums)
  .then(function(data) {

    var albums = [];
    // console.log('Artist albums', data.body);
    // console.log('Artist albums', data.body.items[0].name);
    data.body.items.forEach(function(elt) {
      var obj = {};
      obj["name"] = elt.name;
      if(elt.images.length > 0) {
        obj["image"] = elt.images[0].url;
        // console.log(elt.images[0].url);
      } else {
        obj["image"] = 0
      }
      obj["albumId"] = elt.id;
      albums.push(obj);
    })


    //  console.log("album 1: " + albums[0].name);
    //  console.log("album 2: " + albums[1].name);
    //  console.log("album 3: " + albums[2].image);
    res.render('albums.hbs', {list: albums});
  }, function(err) {
    console.error(err);
  });

  
  

})

app.get('/tracks/:albumId', (req, res) => {
  console.log("albumId: " + req.query.tracks);
  
  spotifyApi.getAlbumTracks(req.query.tracks, { limit : 5, offset : 1 })
  .then(function(data) {
    // console.log(data.body);
    console.log("data.body: " + data.body);
    var tracks = [];
    data.body.items.forEach(function(elt) {
      console.log("name: " + elt.name);
      console.log("track_number: " + elt.track_number);
      console.log("preview_url: " + elt.preview_url);
      var obj = {};
      //Why is track_number starting at 2????
      obj["track_number"] = elt.track_number - 1;
      obj["name"] = elt.name;
      obj["preview_url"] = elt.preview_url;
      obj["track_Id"] = elt.id;
      tracks.push(obj);
    })
 

     console.log("track 1: " + tracks[0].name);
     console.log("track 1 track_number: " + tracks[0].track_number);
     console.log("track 1 preview: " + tracks[0].preview_url);
     console.log("track 2: " + tracks[1].name);
     console.log("track 3: " + tracks[2].name);
     console.log("track 3 track_number: " + tracks[2].track_number);
     console.log("track 3 preview: " + tracks[2].preview_url);

     res.render('tracks.hbs', {list: tracks});

  }, function(err) {
    console.log('Something went wrong!', err);
  });


})



app.listen(3000);