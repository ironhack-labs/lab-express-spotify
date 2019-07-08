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

export default ServerConfig;
