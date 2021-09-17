const SpotifyWebApi = require('spotify-web-api-node');
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
  





exports.readArtist = (req, res) => {
 
    console.log(req.params.id)//ID de parametro

    // BUSCAR EN BASE DE DATOS SI EXISTE UN DATO DEL REQ.PARAMS


    // RESPUESTA

    spotifyApi.getArtistAlbums(`${req.params.id}`)
    
    .then((data)=>{
        //Acceder a todos los albums de la banda
        let albums=data.body.items
    

        console.log(albums)
        res.render("albums",{
            albums:albums
        })
       
    });

    


}