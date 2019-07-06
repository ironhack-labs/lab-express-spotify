"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponseError_1 = __importDefault(require("../Routes/SendResponseError"));
const SpotifiCX_1 = __importDefault(require("../Servicios/SpotifiCX"));
const ArtistAction = {
    validarParams: function (idAlbum) {
        // existe el parametro
        let isValid = !(idAlbum === undefined || idAlbum.trim() === '' || idAlbum === null);
        if (isValid) {
            //tiene longitud correcta
            isValid = idAlbum.length < 30;
        }
        //TODO agrgar mensaje que describa el error de validacion
        return isValid;
    },
    execute: function (res, idArtista) {
        if (!this.validarParams(idArtista)) {
            SendResponseError_1.default(res, "Parámetro idArtista inválido");
            return;
        }
        idArtista = idArtista.toLowerCase();
        SpotifiCX_1.default.artista(idArtista)
            .then((data) => {
            const success = true;
            const msg = "";
            res.json({ idArtista: idArtista, data, success, msg });
        })
            .catch((error) => {
            SendResponseError_1.default(res, error.message);
        });
    }
};
exports.default = ArtistAction;
//# sourceMappingURL=ArtistAction.js.map