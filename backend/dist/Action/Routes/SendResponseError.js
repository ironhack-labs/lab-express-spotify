"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendRespuestaError = function (res, msg) {
    const success = false;
    res.json({ success, msg });
};
exports.default = SendRespuestaError;
;
//# sourceMappingURL=SendResponseError.js.map