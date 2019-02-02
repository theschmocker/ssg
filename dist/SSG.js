"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_promise_1 = require("./util/fs-promise");
const { mkdir, readdir } = fs_promise_1.default;
const fileExists_1 = require("./util/fileExists");
const config_ssg_js_1 = require("../config.ssg.js");
const Page_1 = require("./Page");
const Collection_1 = require("./Collection");
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
     */
    async createSiteDirIfNecessary() {
        const fullPathToSiteDir = path.join(process.cwd(), this.siteDirectory);
        const siteDirExists = await fileExists_1.default(fullPathToSiteDir);
        console.log(mkdir);
        if (!siteDirExists)
            await mkdir(fullPathToSiteDir);
    }
    /**
     * Create site collections to be passed to pages as global context.
     * TODO: Break into smaller functions
     * TODO: Better documentation
     * TODO: Create pages for collections with 'output' set to true
     */
    async createCollections() {
        for (const collection of config_ssg_js_1.collections) {
            try {
                this.collections[collection.name] = new Collection_1.default(collection.name);
            }
            catch (e) {
                console.log(e.message);
                continue;
            }
        }
    }
    /**
     * Create an array of Page objects from markdown files in the base directory
     */
    async createPages() {
        let markdownFiles = (await readdir('.'))
            .filter((fileName) => fileName.endsWith('.md'));
        if (config_ssg_js_1.options.ignoreReadme) {
            markdownFiles = markdownFiles.filter(fileName => !/readme/i.test(fileName));
        }
        this.pages = markdownFiles.map((file) => new Page_1.default(file));
    }
    /**
     * Build an object containing info about the pages in the base directory
     */
    createTopLevelMenu() {
        this.topLevelMenu = this.pages.map(page => ({
            title: page.data.title,
            link: page.data.path,
        }));
    }
    /**
     * Inject all pages with global site data
     */
    injectPagesWithContext() {
        // remove collection metadata
        const collections = Object.keys(this.collections)
            .reduce((colsObject, collection) => (Object.assign({}, colsObject, { [collection]: this.collections[collection].items })), {});
        const context = Object.assign({ menu: this.topLevelMenu }, config_ssg_js_1.site, collections);
        this.pages.forEach(page => {
            page.injectContext(context);
        });
    }
    /**
     * Write pages to the build directory
     */
    async writePages() {
        for (const page of this.pages) {
            this.pageWriter.write(page);
        }
    }
    /**
     * Public method that runs the entire build process
     * @access public
     */
    async build() {
        await this.createSiteDirIfNecessary();
        await this.createPages();
        this.createTopLevelMenu();
        await this.createCollections();
        this.injectPagesWithContext();
        await this.writePages();
    }
}
exports.default = SSG;
