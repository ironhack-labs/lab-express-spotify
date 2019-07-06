"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponseError_1 = __importDefault(require("../Routes/SendResponseError"));
const SpotifiCX_1 = __importDefault(require("../Servicios/SpotifiCX"));
const Config_1 = __importDefault(require("../Config"));
const UrlApi_1 = __importDefault(require("../Routes/UrlApi"));
const urlRel = UrlApi_1.default.Albums;
const urlApi = Config_1.default.urlApi;
const ArtistAlbumsAction = {
    getUrl: function (idArtista, pagina) {
        return Config_1.default.urlApi + urlRel + `/${idArtista}/${pagina}`;
    },
    validarParams: function (idArtista, pagina) {
        // existe el parametro
        let isValid = !(idArtista === undefined || idArtista.trim() === '' || idArtista === null);
        if (isValid) {
            //tiene longitud correcta
            isValid = idArtista.length < 30;
        }
        if (isValid) {
            isValid = parseInt(pagina) > 0;
        }
        //TODO agrgar mensaje que describa el error de validacion
        return isValid;
    },
    execute: function (res, idArtista, pagina) {
        if (!this.validarParams(idArtista, pagina)) {
            SendResponseError_1.default(res, "Parámetros inválidos");
            return;
        }
        const numPagina = parseInt(pagina);
        SpotifiCX_1.default.artistAlbums(idArtista, numPagina)
            .then((data) => {
            const success = true;
            const msg = "";
            const total = data.total;
            const paginaSiguiente = numPagina + 1;
            const next = data.next === "" ? "" : urlApi + "/" + urlRel + `/${idArtista}/${paginaSiguiente}`;
            let d = {
                idArtista,
                next,
                total: data.total,
                items: data.items
            };
            res.json({ data: d, success, msg });
        })
            .catch((error) => {
            SendResponseError_1.default(res, error.message);
        });
    }
};
exports.default = ArtistAlbumsAction;
//# sourceMappingURL=ArtistAlbumsAction.js.map