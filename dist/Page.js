"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matter = require("gray-matter");
const path = require("path");
const convertMarkdownToHTML_1 = require("./util/convertMarkdownToHTML");
/**
 * @typedef Page
 * @class
 */
class Page {
    /**
     * Create a page object based upon a markdown file
     * @param  {string} filePath
     */
    constructor(filePath) {
        this.filePath = filePath;
        this.pageData = this.buildPageData();
    }
    /**
     * Internal method for constructing page data
     */
    buildPageData() {
        const parsedFilePath = path.parse(this.filePath);
        const { data, content } = matter.read(`${this.filePath}`);
        const pageData = Object.assign({}, data, { content });
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
    injectContext(siteData) {
        this.pageData = Object.assign({}, this.pageData, { site: siteData });
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
    async content() {
        const convertedContent = await convertMarkdownToHTML_1.default(this.pageData.content);
        return convertedContent;
    }
}
exports.default = Page;
