require('dotenv').config()


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const path    = require('path');
const func=require('./func');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public')); when this one worked??? huhhh
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });



// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/artists', (req, res, next) => {
  
  console.log('get artists:'+req.query.search);
  
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
	  
	  var newData=func.format(data.body.artists.items);
	  console.log(JSON.stringify(data));
	  
	  res.render('artists',newData);
    console.log("The received data from the API: ", data.body.artists.items[0].name	);
	
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
  
})


app.get('/albums/:artistId', (req, res, next) => {
  
  console.log('get albums artists:'+req.params.artistId);
  
   spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
	  
	
	//  console.log(data);
	//  console.log(data.body.items[2].name);	
	 //  console.log(data.body.items[2].images[0].url);	
	  //  console.log(JSON.stringify(data.body.items[2]));

       var newData=func.format(data.body.items);
	   console.log('sssssss');
	 console.log(JSON.stringify(data.body.items[0]));	
      res.render('albums',newData);	  
	
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
  
})


app.get('/tracks/:albumId', (req, res, next) => {
  
  console.log('get tracks album:'+req.params.albumId);
  
   spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
	  
	  
	
	// console.log(data.body.items);
	// console.log(data.body.items[2].name);	
	//  console.log(data.body.items[2].preview_url);	
	
      res.render('tracks',data.body);	  
	
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
  
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
