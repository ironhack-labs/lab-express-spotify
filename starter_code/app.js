var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

// Remember to paste your credentials here
var clientId = '09a05ebdc88d422a83f8aeaf9f4ee37e',
  clientSecret = '82f381fe4e5e4774b7d2e95ff1dfef41';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  // console.log(req)
  res.render('index') // Render "index.hbs"
})



app.get('/artists', (req, res) => {

  spotifyApi.searchArtists(req.query.a, {
      limit: 10
    })
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // console.log('working promise')
      // console.log('data',data)
      // console.log('items', data.body.artists.items[0])
      let artistList = data.body.artists.items
      res.render('artists', {
        artistList
      }) // Render "index.hbs"
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })

})

// app.get('/albums', (req, res) => {
//   console.log(req)
//   res.render('albums') // Render "index.hbs"
// })


app.get('/artists/:artistId', (req, res) => {
  // code
  let iD = req.params.artistId;

    spotifyApi.getArtistAlbums(iD).then(
      function (data) {
        // console.log('Artist albums', data.body);
        // console.log('id',iD)
        // console.log('show me the JSON',JSON.stringify(data,null,2))
        let albumList = data.body.items
        res.render('albums', {
          albumList
        })
      },
      function (err) {
        console.error(err);
      }
    );
});


app.get('/albums/:albumId', (req,res)=>{
  let iD = req.params.albumId
  spotifyApi.getAlbumTracks(iD)
  .then(function(data) {

    let trackList = data.body.items
    console.log(trackList)
    res.render('tracks',{trackList})


  }, function(err) {
    console.log('Something went wrong!', err);
  })
  // .then(()=>{
    
  // });
})



    app.listen(3000, () => {
      console.log("Server running on port 3000");
    })