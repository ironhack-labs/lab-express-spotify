'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BuildRouter_1 = __importDefault(require("./Routes/BuildRouter"));
const Config_1 = __importDefault(require("./Config"));
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
BuildRouter_1.default(app);
app.listen(Config_1.default.backPort, () => console.log(`backend on  ${Config_1.default.urlApi}!`));
//# sourceMappingURL=server.js.map