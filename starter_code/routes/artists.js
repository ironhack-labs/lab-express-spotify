const express = require("express");
const Router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// const Artist = require('../models/Artist')


const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

const spotifyAPI = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

spotifyAPI.clientCredentialsGrant()
  .then( data => {
    spotifyAPI.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
})

Router.get("/artists", (req, res) => {
  console.log(req.query.artists);
  spotifyAPI.searchArtists(req.query.artists)
  .then(artist =>{
  console.log("The received data from the API: ", artist.body.artists.items)
  res.render('artists', {artist:artist.body.artists.items});
  })
  .catch(err => console.log(err));
})

Router.get('/albums/:id', (req, res) => {
  spotifyAPI.getArtistAlbums(req.params.id)
  .then(album => {console.log(album.body.items)
    res.render('albums', {album:album.body.items})
  })
})

Router.get('/tracks/:id', (req, res) => {
  spotifyAPI.getAlbumTracks(req.params.id)
  .then(tracks => {console.log(tracks.body.items)
    res.render('tracks', {tracks:tracks.body.items})
  })
})
  
//   Artist.find()
//  .then(artists => {
//    console.log(artists)
//    res.render("artist", {artists});
//  })
//  .catch(err => console.log('Error', err))


// Router.get("/:id", (req, res) => {
//  console.log(req.params.id);

//  Artist.findById(req.params.id)
//    .then(artist=> {
//      console.log(artist);
//      res.render("book-info", {artist})
//    })


// })



module.exports = Router;