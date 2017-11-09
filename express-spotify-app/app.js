const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// our first Route:
app.get("/", (request, response, next) => {
  response.send("<p>Welcome Ironhacker. :)</p>");
  next();
});

// Server Started
app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});

var clientId = "6b68cb02053c45579c9711143110fc6c",
  clientSecret = "fa5af90b6bfe4092ac231db2a6326ebdno";

// Iteration 1

app.get("/get-user-info", (req, res) => {
  let artist = req.query.artist;

  res.send(`
  Your name is ${artist}
`);

  res.render("user-info-form");
});

// // Retrieve an access token.
// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     spotifyApi.setAccessToken(data.body["access_token"]);
//   },
//   function(err) {
//     console.log("Something went wrong when retrieving an access token", err);
//   }
// );
