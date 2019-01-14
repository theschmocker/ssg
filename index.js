const path = require('path');

const SSG = require('./src/SSG');
const PageWriter = require('./src/PageWriter');
const Renderer = require('./src/Renderer');

const renderer = new Renderer(path.join(process.cwd(), "_templates"), {
    autoescape: false
})
const pageWriter = new PageWriter(renderer);

const ssg = new SSG(pageWriter);

ssg.build();