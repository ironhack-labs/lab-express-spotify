"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = require("../../../../apps/env.json");
const backPort = 3001;
const frontPort = 4001;
const urlFront = env.site + `:${frontPort}`;
const urlApi = env.site + `:${backPort}/api`;
const ServerConfig = {
    backPort,
    urlFront,
    urlApi
};
exports.default = ServerConfig;
//# sourceMappingURL=Config.js.map