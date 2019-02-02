"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_promise_1 = require("./util/fs-promise");
const { writeFile } = fs_promise_1.default;
/*@class*/
class PageWriter {
    /**
     * @param  {Renderer} renderer - The renderer that writes the pages
     */
    constructor(renderer) {
        this.renderer = renderer;
        this.buildDirectory = path.join(process.cwd(), '_site');
    }
    /**
     * Writes a page to the build directory
     * @param  {Page} page
     */
    async write(page) {
        const pageData = Object.assign({}, page.data, { content: await page.content() });
        const file = this.renderer.render(pageData);
        await writeFile(path.join(this.buildDirectory, pageData.path), file);
    }
}
exports.default = PageWriter;
