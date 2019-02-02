"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const SSG_1 = require("./SSG");
const PageWriter_1 = require("./PageWriter");
const Renderer_1 = require("./Renderer");
const renderer = new Renderer_1.default(path.join(process.cwd(), "_templates"), {
    autoescape: false
});
const pageWriter = new PageWriter_1.default(renderer);
const ssg = new SSG_1.default(pageWriter);
ssg.build();
