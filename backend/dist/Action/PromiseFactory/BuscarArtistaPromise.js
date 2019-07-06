"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clavesSpotify = require('../../../../../../app/credenciales-spotify.json');
const SpotifyWebApi = require('spotify-web-api-node');
console.log(clavesSpotify);
const spotifyApi = new SpotifyWebApi({
    clientId: '828467caa97d4c3591a4b98dec709297',
    clientSecret: 'd5a535f8b664405491374b400885ce48'
});
//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar
exports.solicitarToken = () => {
    // Retrieve an access token
    return spotifyApi.clientCredentialsGrant()
        .then((data) => {
        console.log('token spotify recibido !!!');
        spotifyApi.setAccessToken(data.body['access_token']);
    })
        .catch((error) => {
        console.log('Something went wrong when retrieving an access token', error);
    });
};
function BuscarArtistaPromise(texto) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.BuscarArtistaPromise = BuscarArtistaPromise;
//# sourceMappingURL=BuscarArtistaPromise.js.map