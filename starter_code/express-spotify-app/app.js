const express = require('express');
const app = express();


// *** spotify api
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'd6e32093de944ed99cbf6c74b3bedf7a',
    clientSecret = 'f34b638d117540efb1420e2ea7ed097b';

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
// *** spotify api




app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html')
})

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      let html = ''
      data.body.artists.items.map(i => {
        let img_url = ''
        i.images.length ? img_url = i.images[0].url : img_url = ''
        html +=  
          `<div>
            <img src=${img_url} alt="" height='100px' width='100px'>
            <p>${i.name}</p>
            <button>
              <a href='./albums/${i.id}'>View Album</a>
            </button>
          </div>`
      })
      res.send(html)
      // res.send(data.body.artists.items)
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.error(err)
    })
})
app.get('/albums/:artistId', (req, res) => {
  const artist_id = req.params.artistId
  // res.send('heeeeeel')
  // console.log(req.params)
  // fetch(http)
  //   .then(data => res.send(data))
  spotifyApi.getArtistAlbums(artist_id).then(
    function(data) {
      // console.log('Artist albums', data.body);
      let html = ''
      data.body.items.map(i => {
        let img_url = ''
        i.images.length ? img_url = i.images[0].url : img_url = ''
        html +=  
          `<div>
            <img src=${img_url} alt="" height='100px' width='100px'>
            <p>${i.name}</p>
            <button>
              <a href='./albums/${i.id}'>View Album</a>
            </button>
          </div>`
      })
      res.send(html)
    },
    function(err) {
      console.error(err);
    }
  );
});



app.listen(3004)


