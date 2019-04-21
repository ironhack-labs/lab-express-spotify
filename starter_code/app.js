const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');



// setting the spotify-api goes here:

const clientId = '17e4a0b1ba384095bb2ce6f6bc757845',
    clientSecret = 'd16229937f6943a1881a81617670abc0';

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
  })

app.get('/artists', (req, res, next) => {
     console.log(req.query.search)
    spotifyApi.searchArtists(req.query.search)

    .then(data => {
    res.render('list-artists', {
        artistResult: data.body.artists.items,
        searchResult: req.query.search
    });
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
  })


  app.get('/albums/:artistsId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistsId)
    .then(data =>{
      res.render('albums',{
        albumResult: data.body.items,
        })
    })
    .catch(err=>{
      console.log("I got an error",err)
  })
})

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId) 
  .then(data =>{
    res.render('list-tracks',{
      tracksResult: data.body.items
    })
  })
  .catch(err=>{
    console.log("I got an error",err)
})
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
