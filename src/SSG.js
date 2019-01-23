const path = require('path');
const matter = require('gray-matter');
const { mkdir, readdir } = require('./util/fs-promise');

const fileExists = require('./util/fileExists');
const { options, site: siteData, collections } = require('../config.ssg.js');

const Page = require('./Page');
const Collection = require('./Collection');

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
        this.collections = {};
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
     * Create site collections to be passed to pages as global context.
     * TODO: Break into smaller functions
     * TODO: Better documentation
     * TODO: Create pages for collections with 'output' set to true
     * @access private
     */
    async _createCollections() {
        for (const collection of collections) {
            try {
                this.collections[collection.name] = await new Collection(collection.name);
            } catch (e) {
                console.log(e);
                continue;
            }
        }
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
    _injectPagesWithContext() {
        // remove collection metadata
        const collections = Object.keys(this.collections)
            .reduce((colsObject, collection) => ({
                ...colsObject,
                [collection]: this.collections[collection].items,
            }), {});

        const context = {
            menu: this.topLevelMenu,
            ...siteData,
            ...collections
        }

        this.pages.forEach(page => {
            page.injectContext(context);
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
        await this._createCollections();
        this._injectPagesWithContext();
        await this._writePages();
    }
}

module.exports = SSG;