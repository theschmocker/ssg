import * as path from 'path';

import SSG from './SSG';
import PageWriter from './PageWriter';
import Renderer from './Renderer';

const renderer = new Renderer(path.join(process.cwd(), "_templates"), {
    autoescape: false
})
const pageWriter = new PageWriter(renderer);

const ssg = new SSG(pageWriter);

ssg.build();