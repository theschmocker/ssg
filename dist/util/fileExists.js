"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_promise_1 = require("./fs-promise");
const { access, constants } = fs_promise_1.default;
/**
 * Uses fs.access to determine whether or not a file exists
 * @param  {string} fileName - the filename (or path) to be checked for existence
 * @return {Promise} A promise that resolves to true or false, depending on whether or not the file exists
 */
async function fileExists(fileName) {
    try {
        await access(fileName, constants.F_OK);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.default = fileExists;
