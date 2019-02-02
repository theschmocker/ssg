import * as path from 'path';
import fsPromise from './util/fs-promise';

const { mkdir, readdir } = fsPromise;

import fileExists from './util/fileExists';
import { options, site as siteData, collections } from '../config.ssg.js';

import Page from './Page';
import Collection from './Collection';

/** Main static site generating class
 * TODO: Improve this class' docblocks
 */
class SSG {
    protected siteDirectory: string;
    protected pages: any[];
    protected topLevelMenu: any[];
    protected pageWriter: any;
    protected collections: any;

    /**
     * Create the static site generator
     * @param  {PageWriter} pageWriter - The PageWriter object to be used in the writing of pages
     */
    constructor(pageWriter: any) {
        this.siteDirectory = '_site';
        this.pages = [];
        this.topLevelMenu = [];
        this.pageWriter = pageWriter;
        this.collections = {};
    }

    /**
     * Creates the _site build directory if it doesn't exist
     */
    private async createSiteDirIfNecessary() {
        const fullPathToSiteDir = path.join(process.cwd(), this.siteDirectory)
        const siteDirExists = await fileExists(fullPathToSiteDir);

        console.log(mkdir);
        if (!siteDirExists) await mkdir(fullPathToSiteDir);
    }

    /**
     * Create site collections to be passed to pages as global context.
     * TODO: Break into smaller functions
     * TODO: Better documentation
     * TODO: Create pages for collections with 'output' set to true
     */
    private async createCollections() {
        for (const collection of collections) {
            try {
                this.collections[collection.name] = new Collection(collection.name);
            } catch (e) {
                console.log(e.message);
                continue;
            }
        }
    }


    /**
     * Create an array of Page objects from markdown files in the base directory
     */
    private async createPages() {
        let markdownFiles = 
            (await readdir('.'))
                .filter((fileName: string) => fileName.endsWith('.md'));
            
        if (options.ignoreReadme) {
            markdownFiles = markdownFiles.filter(fileName => !/readme/i.test(fileName));
        }

        this.pages = markdownFiles.map((file: string) => new Page(file));
    }

    /**
     * Build an object containing info about the pages in the base directory
     */
    private createTopLevelMenu() {
        this.topLevelMenu = this.pages.map(page => ({
            title: page.data.title,
            link: page.data.path,
        }));
    }

    /**
     * Inject all pages with global site data
     */
    private injectPagesWithContext() {
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
     */
    private async writePages() {
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
        this.createTopLevelMenu()
        await this.createCollections();
        this.injectPagesWithContext();
        await this.writePages();
    }
}

export default SSG;