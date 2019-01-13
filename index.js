const path = require('path');
const siteData = require('./config.ssg.js').site;
const { promisify } = require('util');
const fs = require('fs');

const Renderer = require('./src/Renderer');
const Page = require('./src/Page');
const PageWriter = require('./src/PageWriter');

/**
 * Promisified wrapper of fs.mkdir
 * @function mkdir
 */
const mkdir = promisify(fs.mkdir);

/**
 * Promisified wrapper of fs.readdir
 * @function readdir
 */
const readdir = promisify(fs.readdir);

/**
 * Promisified wrapper of fs.writeFile
 * @function writeFile
 */
const writeFile = promisify(fs.writeFile);

/**
 * Uses fs.access to determine whether or not a file exists
 * @param  {string} fileName - the filename (or path) to be checked for existence
 * @return {Promise} A promise that resolves to true or false, depending on whether or not the file exists
 */
async function exists(fileName) {
    return new Promise(resolve => {
        fs.access(fileName, fs.constants.F_OK, err => {
            resolve(!err);
        })
    })
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