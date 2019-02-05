const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + "/views/partials");


//Spotify 
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
const clientId = '68066f567475414abf720987c8d38af1',
    clientSecret = '1570cb230276449095f1976c60a616c3';

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
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:






// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

//Routes
//----------------------------------------
//########################################

app.get("/", (request, response, next)=>{
    response.render("index");
});

app.get("/artists", (request, response, next)=>{
    const {search_query} = request.query;

    spotifyApi.searchArtists(search_query)
    .then(data => {
  
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.locals.reponseOfSearch = data.body.artists.items;
    //   response.json(data);
      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (request, response, next)=>{
    // requestt.params is how you acces information in the PETH/URL of you route
    //  request.params = {"netflixId": "80018191"}
    // response.send(request.params);


    const {artistId} = request.params;

        spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            // response.json(data);
            console.log('Artist albums', data.body);
            //if we had a database we would do it like this
            response.locals.artistId = data.body.items;
            response.render("albums.hbs");
        }).catch(err => {

            console.error(err);
        });
});