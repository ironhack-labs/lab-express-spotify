"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BuscarArtistAction_1 = __importDefault(require("../BuscarArtistAction"));
function routerBuilder(app) {
    app.get("/debug", function (req, res) {
        res.send('yea baby');
    });
    app.get("/", function (req, res) {
        res.send('i´m backend :)');
    });
    app.get("/buscar-artista/:texto", function (req, res) {
        let texto = req.params.texto || null;
        BuscarArtistAction_1.default.execute(res, texto);
    });
}
exports.default = routerBuilder;
//# sourceMappingURL=BuildRouter.js.map