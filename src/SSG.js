const path = require('path');
const { mkdir, readdir } = require('./util/fs-promise');

const fileExists = require('./util/fileExists');
const { options, site: siteData } = require('../config.ssg.js');

const Page = require('./Page');

/** Main static site generating class
 * TODO: Improve this class' docblocks
 */
class SSG {
    /**
     * Create the static site generator
     * @param  {PageWriter} pageWriter - The PageWriter object to be used in the writing of pages
     */
    constructor(pageWriter) {
        this.siteDirectory = '_site';
        this.pages = [];
        this.topLevelMenu = [];
        this.pageWriter = pageWriter;
    }

    /**
     * Creates the _site build directory if it doesn't exist
     * @access private
     */
    async _createSiteDirIfNecessary() {
        const fullPathToSiteDir = path.join(process.cwd(), this.siteDirectory)
        const siteDirExists = await fileExists(fullPathToSiteDir);

        if (!siteDirExists) await mkdir(fullPathToSiteDir);
    }

    /**
     * Create an array of Page objects from markdown files in the base directory
     * @access private
     */
    async _createPages() {
        let markdownFiles = 
            (await readdir('.'))
                .filter(fileName => fileName.endsWith('.md'));
            
        if (options.ignoreReadme) {
            markdownFiles = markdownFiles.filter(fileName => !/readme/i.test(fileName));
        }

        this.pages = markdownFiles.map(file => new Page(file));
    }

    /**
     * Build an object containing info about the pages in the base directory
     * @access private
     */
    _createTopLevelMenu() {
        this.topLevelMenu = this.pages.map(page => ({
            title: page.data.title,
            link: page.data.path,
        }));
    }

    /**
     * Inject all pages with global site data
     * @access private
     */
    _injectPagesWithSiteData() {
        const data = {
            menu: this.topLevelMenu,
            ...siteData
        }

        this.pages.forEach(page => {
            page.injectSiteData(data);
        });
    }

    /**
     * Write pages to the build directory
     * @access private
     */
    async _writePages() {
        for (const page of this.pages) {
            this.pageWriter.write(page);
        }
    }

    /**
     * Public method that runs the entire build process
     * @access public
     */
    async build() {
        await this._createSiteDirIfNecessary();
        await this._createPages();
        this._createTopLevelMenu()
        this._injectPagesWithSiteData();
        await this._writePages();
    }
}

module.exports = SSG;