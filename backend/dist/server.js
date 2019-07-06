'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BuildRouter_1 = __importDefault(require("./Routes/BuildRouter"));
const SpotifiCX_1 = __importDefault(require("./Servicios/SpotifiCX"));
const Config_1 = __importDefault(require("./Config"));
var cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
SpotifiCX_1.default.solicitarToken(null)
    .then(() => {
    console.log('token spotify recibido !!!');
})
    .catch((error) => {
    console.log('error al solicitar token spotify error');
});
BuildRouter_1.default(app);
app.listen(Config_1.default.port, () => console.log(`backend on  ${Config_1.default.urlBase}!`));
//# sourceMappingURL=server.js.map