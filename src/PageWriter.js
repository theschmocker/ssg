const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

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
        const pageData = {
            ...page.data,
            content: await page.content()
        }

        const file = this.renderer.render(pageData);
        await writeFile(path.join(this.buildDirectory, pageData.path), file);
    }
}

module.exports = PageWriter;