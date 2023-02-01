"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
class customError extends Error {
    constructor(errstatuscode, message) {
        super(message);
        this.errstatuscode = errstatuscode;
        this.message = message;
        this.status = "failure";
    }
}
exports.customError = customError;
