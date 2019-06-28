"use strict";

const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
    clientId: '828467caa97d4c3591a4b98dec709297',
    clientSecret: 'd5a535f8b664405491374b400885ce48'
});

//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar


export const solicitarToken = async () => {

// Retrieve an access token
    return spotifyApi.clientCredentialsGrant()
        .then((data: any) => {
            console.log('token spotify recibido !!!')
            spotifyApi.setAccessToken(data.body['access_token']);
        })
        .catch((error: any) => {
            console.log('Something went wrong when retrieving an access token', error);
        })

};



export async function BuscarArtistaPromise(texto: String): Promise<any> {


}