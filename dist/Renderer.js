"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
class Renderer {
    /**
     * Create a new template Renderer
     * @param  {string} templateDirectory - Path to template directory from the project root
     * @param  {object} [options] - Options passed to the templating engine
     */
    constructor(templateDirectory, options) {
        nunjucks.configure(templateDirectory, options);
    }
    /**
     * Render page to HTML
     * @param  {object} data - Data for rendering a page
     * @param  {object} [data.template] - Name of template
     *
     * @return {string} Rendered HTML
     */
    render(_a) {
        var { template } = _a, data = __rest(_a, ["template"]);
        if (!template)
            template = 'default';
        if (!template.endsWith('.njk'))
            template += '.njk';
        return nunjucks.render(template, data);
    }
}
exports.default = Renderer;
