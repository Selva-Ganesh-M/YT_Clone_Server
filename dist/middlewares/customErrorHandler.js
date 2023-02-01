"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrorHandler = void 0;
const customErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let errstatus;
    if (err.status >= 100 && err.status < 600) {
        errstatus = err.status;
    }
    else {
        errstatus = 500;
    }
    const message = err.message;
    const stack = err.stack ? err.stack : "no stack is provided.";
    console.log("ceh end.");
    res.status(errstatus).json({
        errstatus, message, stack
    });
});
exports.customErrorHandler = customErrorHandler;
