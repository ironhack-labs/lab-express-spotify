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

//Create a home page
app.get("/", (req,res)=> {
    res.render("index")
})

//Display results for artist search

//In index.hbs, our search form was submitted to the /artist-search route so we need to create one here. This route will recieve the same search term (/artist-search)

//we use asych await to handle the API request; await is used for the asych API call to complete and return the search results

//REQ.QUERY
//Next, we create a variable (allSearchedArtist) to store the value that results from using the .searchArtists method which comes from the npm package (within the spotify-web-api.js file)

//This route recieves a query parameter named artist from the request, which represents the artist's name the user wants to search for (Fleetwood Mac in my example). This must correspond with the name attribute in the input of the HBS file

//RES.RENDER
//res.render() method is used to render a specific view template and pass data to that HTML view. "artist-search-result" is the name o fthe view template that we want to render. This should correspond to the hame of the handlebars file.

//bananas is created as a short hand for the value associated with allSearchedArtists.body.artists.items. This value is an array of artist items recieved from the Spotify API search. We pass this array as an object using {{bananas}} so that HBS can read it. Bananas is considered a key here and we use this variable name in the Handlebars template to access the data we're passing. Therefore, bananas must be used in the #each loop in the artist-search-results.hbs file

//allSearchedArtist.body.artists.items referrs to the structure of the response data returned by the Spotify API. It does not relate to the parameter defined in req.query.artist. 


app.get("/artist-search", async (req,res) => {
try {
     let allSearchedArtist= await spotifyApi.searchArtists(req.query.artist);
      console.log('The received data from the API: ', allSearchedArtist.body.artists.items);
  res.render("artist-search-results",{
    bananas: allSearchedArtist.body.artists.items
  });
}
catch(error){
    console.log(error)
}
})

// we use {} around artistID to inidcate using object destructuring to extract a property from the req.params object. 
//We use {} around albums because it is an array on information and we need to pass it as an object. An alternative way of writing it is {albums: albumns}

app.get("/albums/:artistId", async (req, res) => {
    try {
      const { artistId } = req.params;
      const artistAlbums = await spotifyApi.getArtistAlbums(artistId);
      const albums = artistAlbums.body.items;
      res.render("albums", { albums });
    } catch (error) {
      console.log("Error: ", error);
    }
  });
  
  app.get("/tracks/:albumId", async (req, res) => {
    try {
      const { albumId } = req.params;
      const albumTracks = await spotifyApi.getAlbumTracks(albumId);
      const tracks = albumTracks.body.items;
      res.render("tracks", { tracks });
    } catch (error) {
      console.log("Error: ", error);
    }
  

})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)