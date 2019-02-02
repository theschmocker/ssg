import * as path from 'path';
import fsPromise from './util/fs-promise';

const { writeFile } = fsPromise;

/*@class*/
class PageWriter {
    private buildDirectory: string;
    /**
     * @param  {Renderer} renderer - The renderer that writes the pages
     */
    constructor(private renderer) {
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

export default PageWriter;