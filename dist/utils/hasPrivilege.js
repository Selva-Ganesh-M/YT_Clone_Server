"use strict";
// method to check whether the user has privilage to do the requested action
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("./customError");
exports.default = (option1, option2) => {
    if (option1 !== option2)
        throw new customError_1.customError(409, "update failed: You can only update your details only.");
};
