const fs = require('fs');
const { promisify } = require('util');

const fsFunctions = Object.keys(fs)
    .filter(funcName => !funcName.includes('Sync')); // exclude synchronous functions


const FSPromise = {};

fsFunctions.forEach(funcName => {
    Object.defineProperty(FSPromise, funcName, { get: () => promisify(fs[funcName])});
});

module.exports = FSPromise;