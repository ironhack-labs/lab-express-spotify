//Requirements

const SpotifyWebApi = require('spotify-web-api-node');
const express = require ("express");
const expressLayouts = require ("express-ejs-layouts");
const bodyParser = require("body-parser");

//Initialize
const app = express();

//Use Packages
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(express.static("public"));

//Set Packages
app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Remember to paste here your credentials
const clientId = '10d9f0d8d7bb4f3f82ada0f09f4ac47b',
      clientSecret = '79ceee0ae22b4b41b9c064a303f6a6c7';

const spotifyApi = new SpotifyWebApi({
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

//Routes


app.get("/", function(req, res, next){
  res.render("home");
})

app.get("/artist", function(req, res, next){
  res.render("artist");
})

app.post("/artist", function(req, res, next){
  spotifyApi.searchArtists(req.body.artist)
  .then((response) => {
  const aList = response.body.artists.items;
  res.render("artistresult", {artistList:aList,});
  })
  .catch((err) => {
    console.log(err);
  });
})


/* USE IN HTML TO PRINT NAMES
<div id="artist-names">
  <%for(i = 0; i <= 3; i++){%>
    <h1><%=artistList[i].name%></h1>
  <%}%>
</div>
*/








app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Your server is functioning correctly at port 3000");
})