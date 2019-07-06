"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BuscarArtistAction_1 = __importDefault(require("../Action/BuscarArtistAction"));
const ArtistAlbumsAction_1 = __importDefault(require("../Action/ArtistAlbumsAction"));
const TracksAction_1 = __importDefault(require("../Action/TracksAction"));
const UrlApi_1 = __importDefault(require("./UrlApi"));
function routerBuilder(app) {
    app.get("/debug", function (req, res) {
        res.send('yea baby');
    });
    app.get("/", function (req, res) {
        res.send('i´m backend :)');
    });
    //'buscar-artista'
    app.get(`/api/${UrlApi_1.default.BuscarArtista}/:texto/:pagina?`, function (req, res) {
        let texto = req.params.texto || "";
        let pagina = req.params.pagina || "1";
        BuscarArtistAction_1.default.execute(res, texto, pagina);
    });
    //artist-albums
    app.get(`/api/${UrlApi_1.default.Albums}/:idArtista/:pagina?`, function (req, res) {
        let idArtista = req.params.idArtista || "";
        let pagina = req.params.pagina || "1";
        ArtistAlbumsAction_1.default.execute(res, idArtista, pagina);
    });
    //tracks
    app.get(`/api/${UrlApi_1.default.Tracks}/:idAlbum/:pagina?`, function (req, res) {
        let idAlbum = req.params.idAlbum || "";
        let pagina = req.params.pagina || "1";
        TracksAction_1.default.execute(res, idAlbum, pagina);
    });
}
exports.default = routerBuilder;
//# sourceMappingURL=BuildRouter.js.map