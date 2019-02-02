"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remark = require("remark");
const html = require("remark-html");
/**
 * @param  {string} markdown - The markdown content to be converted
 * @returns {Promise} A promise with the converted HTML content
 */
function convertMarkdownToHTML(markdown) {
    return new Promise((resolve, reject) => {
        remark()
            .use(html)
            .process(markdown, (err, file) => {
            if (err)
                reject(err);
            resolve(file.contents);
        });
    });
}
exports.default = convertMarkdownToHTML;
