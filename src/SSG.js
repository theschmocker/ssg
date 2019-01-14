const path = require('path');
const { mkdir, readdir } = require('./util/fs-promise');

const fileExists = require('./util/fileExists');
const { options, site: siteData } = require('../config.ssg.js');

const Page = require('./Page');

class SSG {
    constructor(pageWriter) {
        this.siteDirectory = '_site';
        this.pages = [];
        this.topLevelMenu = [];
        this.pageWriter = pageWriter;
    }

    async _createSiteDirIfNecessary() {
        const fullPathToSiteDir = path.join(process.cwd(), this.siteDirectory)
        const siteDirExists = await fileExists(fullPathToSiteDir);

        if (!siteDirExists) await mkdir(fullPathToSiteDir);
    }

    async _createPages() {
        let markdownFiles = 
            (await readdir('.'))
                .filter(fileName => fileName.endsWith('.md'));
            
        if (options.ignoreReadme) {
            markdownFiles = markdownFiles.filter(fileName => !/readme/i.test(fileName));
        }

        this.pages = markdownFiles.map(file => new Page(file));
    }

    _createTopLevelMenu() {
        this.topLevelMenu = this.pages.map(page => ({
            title: page.data.title,
            link: page.data.path,
        }));
    }

    _injectPagesWithSiteData() {
        const data = {
            menu: this.topLevelMenu,
            ...siteData
        }

        this.pages.forEach(page => {
            page.injectSiteData(data);
        });
    }

    async _writePages() {
        for (const page of this.pages) {
            this.pageWriter.write(page);
        }
    }

    async build() {
        await this._createSiteDirIfNecessary();
        await this._createPages();
        this._createTopLevelMenu()
        this._injectPagesWithSiteData();
        await this._writePages();
    }
}

module.exports = SSG;