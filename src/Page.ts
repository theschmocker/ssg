import * as matter from 'gray-matter';
import * as path from 'path';
import convertMarkdownToHTML from './util/convertMarkdownToHTML';

/** 
 * @typedef Page
 * @class
 */
class Page {
    private pageData: any;

    /**
     * Create a page object based upon a markdown file
     * @param  {string} filePath 
     */
    constructor(public filePath: string) {
        this.pageData = this.buildPageData();
    }

    /**
     * Internal method for constructing page data
     */
    private buildPageData() {
        const parsedFilePath = path.parse(this.filePath);

        const { data, content } = matter.read(`${this.filePath}`);

        const pageData: { content:string, [key: string]: any } = {
            ...data,
            content,
        };

        pageData.path = `/${parsedFilePath.name}.html`;

        return pageData;
    }

    /**
     * Used to inject global data into a page
     * @example
     * //accessible in template under site.menu
     * page.injectContext({ menu: menuItems });
     * 
     */
    injectContext(siteData: any) {
        this.pageData = {
            ...this.pageData,
            site: siteData
        }
    }
    /**
     * Accessor for internal page data
     */
    get data() {
        return this.pageData;
    }

    /**
     * Used to get the HTML content derived from markdown
     * @return {Promise} Resolves to the pages markdown content converted to HTML
     */
    async content(): Promise<string> {
        const convertedContent = await convertMarkdownToHTML(this.pageData.content);
        return convertedContent;
    }
}

export default Page;