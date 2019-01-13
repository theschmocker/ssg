const path = require('path');
const siteData = require('./config.ssg.js').site;

const { mkdir, readdir, access, constants: fsConstants } = require('./src/util/fs-promise');

const Renderer = require('./src/Renderer');
const Page = require('./src/Page');
const PageWriter = require('./src/PageWriter');

/**
 * Uses fs.access to determine whether or not a file exists
 * @param  {string} fileName - the filename (or path) to be checked for existence
 * @return {Promise} A promise that resolves to true or false, depending on whether or not the file exists
 */
async function exists(fileName) {
    try {
        await access(fileName, fsConstants.F_OK);
        return true;
    } catch (e) {
        return false
    }
}

/**
 * Build the site
 * TODO: Split this up into smaller functions
 */
async function buildSite() {
    const markdownFiles = (await readdir('.')).filter(fileName => fileName.endsWith('.md'));
    const pages = markdownFiles.map(file => new Page(file));

    const topLevelMenu = pages.map(page => ({
        title: page.data.title,
        link: page.data.path,
    }));
    
    const siteDirExists = await exists('./_site');
    if (!siteDirExists) await mkdir('./_site');

    const pageWriter = new PageWriter(new Renderer(path.join(process.cwd(), "_templates"), { 
        autoescape: false 
    }));

    for (page of pages) {
        page.injectSiteData({ menu: topLevelMenu, ...siteData });
        pageWriter.write(page);
    }
}

buildSite();