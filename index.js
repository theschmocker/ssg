const matter = require('gray-matter');
const remark = require('remark');
const html = require('remark-html');
const path = require('path');
const siteData = require('./config.ssg.js').site;
const { promisify } = require('util');
const fs = require('fs');

const SSG = require('./src/SSG');
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
 * Returns a filename without its extension
 * @example
 * //returns 'index'
 * fileNameWithoutExtension('index.md')
 * @param  {string} fileName
 */
function fileNameWithoutExtension(fileName) {
    return fileName.split('.')[0];
}


/**
 * Builds an object representation of a top-level page. Uses gray-matter to read markdown file
 * 
 * @param  {object} markdownFile
 * @returns {object} Representation of a top-level page
 */
function createPage(markdownFile) {
    const fileName = fileNameWithoutExtension(markdownFile);

    const pageData = matter.read(`./${markdownFile}`);
    pageData.data.path = `/${fileName}.html`;

    return pageData;
}
/**
 * Writes a page (rendered by Nunjucks) to the _site directory.
 * 
 * @param  {object} page A page object created by {@link createPage}
 * @param  {object} globalData
 */
async function writePage(page, globalData) {
    const content = await convertMarkdownToHTML(page.content);

    const data = {
        ...page.data,
        content,
        site: globalData,
    };

    const renderer = new Renderer();

    const rendered = renderer.render(data);

    await writeFile(`_site${page.data.path}`, rendered);
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