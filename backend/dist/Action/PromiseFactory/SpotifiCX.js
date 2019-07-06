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
//confirmar que se len las claves desde el path
//console.log(clavesSpotify);
const spotifyApi = new SpotifyWebApi(clavesSpotify);
//Paso 1 solicitar token de autoriacion, ponerlo como function proque se puede volver a necesitar
// Retrieve an access token
const solicitarToken = () => __awaiter(this, void 0, void 0, function* () {
    return spotifyApi.clientCredentialsGrant()
        .then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
    }).catch((error) => {
        console.log('Error al solicitar token');
        throw error;
    });
});
const buscarArtista = (texto) => __awaiter(this, void 0, void 0, function* () {
    return spotifyApi.searchArtists(texto)
        .then((data) => {
        return data.body;
    })
        .catch((error) => {
        console.log("The error while searching artists occurred: ", error);
        throw error;
    });
});
exports.default = {
    solicitarToken,
    buscarArtista,
};
//# sourceMappingURL=SpotifiCX.js.map