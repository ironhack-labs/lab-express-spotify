"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponseError_1 = __importDefault(require("../Routes/SendResponseError"));
const SpotifiCX_1 = __importDefault(require("../Servicios/SpotifiCX"));
const AlbumsAction = {
    validarParams: function (idAlbum, idPagina) {
        // existe el parametro
        let isValid = !(idAlbum === undefined || idAlbum.trim() === '' || idAlbum === null);
        if (isValid) {
            //tiene longitud correcta
            isValid = idAlbum.length < 30;
        }
        if (isValid) {
            let idPaginaAsNumero = parseInt(idPagina);
            isValid = idPaginaAsNumero > 0;
        }
        //TODO agrgar mensaje que describa el error de validacion
        return isValid;
    },
    execute: function (res, idAlbum, idPagina) {
        if (!this.validarParams(idAlbum, idPagina)) {
            SendResponseError_1.default(res, "Parámetros inválidos");
            return;
        }
        const limit = 10;
        const offset = parseInt(idPagina) - 1;
        SpotifiCX_1.default.albums(idAlbum, { limit, offset })
            .then((data) => {
            const success = true;
            const msg = "";
            res.json({ texto: idAlbum, data, success, msg });
        })
            .catch((error) => {
            SendResponseError_1.default(res, error.message);
        });
    }
};
exports.default = AlbumsAction;
//# sourceMappingURL=AlbumsAction.js.map