const matter = require('gray-matter');
const path = require('path');
const convertMarkdownToHTML = require('./util/convertMarkdownToHTML');

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
        this.pageData = this._buildPageData(filePath);
    }

    /**
     * Internal method for constructing page data
     * @access private
     */
    _buildPageData() {
        const parsedFilePath = path.parse(this.filePath);

        const { data, content } = matter.read(`${this.filePath}`);

        const pageData = {
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
     * page.injectSiteData({ menu: menuItems });
     * 
     * @param  {object} siteData 
     */
    injectSiteData(siteData) {
        this.pageData = {
            ...this.pageData,
            site: siteData
        }
    }
    /**
     * Accessor for internal page data
     * @return {object} pageData
     */
    get data() {
        return this.pageData;
    }

    /**
     * Used to get the HTML content derived from markdown
     * @return {Promise} Resolves to the pages markdown content converted to HTML
     */
    async content() {
        const convertedContent = await convertMarkdownToHTML(this.pageData.content);
        return convertedContent;
    }
}

module.exports = Page;