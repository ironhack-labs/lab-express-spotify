require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res,) => {
    console.log("Welcome to the homepage");
    res.render("home");
  });
  
  //artist-search-results
  
  app.get("/artist-search-results", (req, res,) => {
    console.log(req.query.newArtist);
  
    let newestArtist = req.query.newArtist; //query artist search
  
    spotifyApi
      .searchArtists(newestArtist) 
      //we use the spotifyApi method search artist adn pass it my newestArtist query
      .then((data) => {
        //we receive the array with objects
        console.log("The received data from the API: ", data.body.artists.items); //we see the array in the console and start navigating until getting the LPs
        res.render("artist-search-results", data.body.artists.items);
  
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });
  //tracks
  app.get("/albums/views-tracks/:id", (req, res, next) => {
    const albumId = req.params.id;
    spotifyApi.getAlbumTracks(albumId)
    .then((data) => {
      console.log("Album tracks", data.body.items);
      res.render("views-tracks", { tracks: data.body.items });
    })
    .catch((err) => {
      console.error(err);
      // Handle the error gracefully, e.g., render an error view or send an error response.
      res.render("error", { error: "Error occurred while fetching album tracks" });
    });
});

  //albums
  ////////////////////////////////////////////////////
  app.get("/albums/:artistId", (req, res, next) => {
    console.log(req.params);
  
    
    spotifyApi.getArtistAlbums(req.params.artistId)
      .then((data) => {
        console.log("Artist albums", data.body.items);
        res.render("albums", data.body.items);
      })
      .catch((err) => {
        console.error(err);
        // Handle the error gracefully, e.g., render an error view or send an error response.
        res.render("error", { error: "Error occurred while fetching albums" });
      });
      
  });
  app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
  );
  