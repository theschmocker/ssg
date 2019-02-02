"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const SUPPORTED_FILE_TYPES = [
    'md',
    'markdown',
    'html'
];
function File(fileName) {
    const extension = path.parse(fileName).ext.slice(1);
    if (SUPPORTED_FILE_TYPES.includes(extension)) {
        console.log(`WOOHOOO, ${extension} is a supported filetype`);
    }
}
exports.default = File;
