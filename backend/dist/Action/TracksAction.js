"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponseError_1 = __importDefault(require("../Routes/SendResponseError"));
const SpotifiCX_1 = __importDefault(require("../Servicios/SpotifiCX"));
const Config_1 = __importDefault(require("../Config"));
const UrlApi_1 = __importDefault(require("../Routes/UrlApi"));
const urlApi = Config_1.default.urlApi;
const urlRel = UrlApi_1.default.Tracks;
const TracksAction = {
    getUrl: function (texto, pagina) {
        return Config_1.default.urlApi + urlRel + `/${texto}/${pagina}`;
    },
    validarParams: function (idAlbum, pagina) {
        // existe el parametro
        let isValid = !(idAlbum === undefined || idAlbum.trim() === '' || idAlbum === null);
        if (isValid) {
            //tiene longitud correcta
            isValid = idAlbum.length < 30;
        }
        if (isValid) {
            isValid = parseInt(pagina) > 0;
        }
        //TODO agrgar mensaje que describa el error de validacion
        return isValid;
    },
    execute: function (res, idAlbum, pagina) {
        if (!this.validarParams(idAlbum, pagina)) {
            SendResponseError_1.default(res, "Parámetros inválido");
            return;
        }
        const numPagina = parseInt(pagina);
        SpotifiCX_1.default.tracks(idAlbum, numPagina)
            .then((data) => {
            const success = true;
            const msg = "";
            const total = data.total;
            const paginaSiguiente = numPagina + 1;
            const next = data.next === "" ? "" : urlApi + '/' + urlRel + `/${idAlbum}/${paginaSiguiente}`;
            let d = {
                idAlbum,
                next,
                total: data.total,
                items: data.items
            };
            res.json({ idAlbum, data: d, success, msg });
        })
            .catch((error) => {
            SendResponseError_1.default(res, error.message);
        });
    }
};
exports.default = TracksAction;
//# sourceMappingURL=TracksAction.js.map