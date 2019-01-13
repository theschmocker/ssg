const fs = require('fs');
const { promisify } = require('util');

const fsProps = Object.keys(fs)
    .filter(prop => !prop.includes('Sync')); // exclude synchronous functions


const FSPromise = {};

/**
 * Promisify functions and add them to FSPromise. Other properties of fs are added as-is
 */
fsProps.forEach(prop => {
    if (typeof fs[prop] === 'function') {
        Object.defineProperty(FSPromise, prop, { get: () => promisify(fs[prop]) });
    } else {
        FSPromise[prop] = fs[prop];
    }
});

module.exports = FSPromise;