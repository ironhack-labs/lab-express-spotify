"use strict";

const clavesSpotify = require('../../../../../../app/credenciales-spotify.json');
const SpotifyWebApi = require('spotify-web-api-node');

//confirmar que se len las claves desde el path
//console.log(clavesSpotify);


const spotifyApi = new SpotifyWebApi(clavesSpotify);

//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar


const solicitarToken = async () => {

   // Retrieve an access token
   return spotifyApi.clientCredentialsGrant()
       .then((data: any) => {
          spotifyApi.setAccessToken(data.body['access_token']);
       })
};

const buscarArtista = async () => {

};

export default {
   solicitarToken,
   buscarArtista,
}
