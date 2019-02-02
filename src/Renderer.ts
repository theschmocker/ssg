import * as nunjucks from 'nunjucks';

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
    render({ template, ...data }) {
        if (!template) template = 'default';
        if (!template.endsWith('.njk')) template += '.njk';

        return nunjucks.render(template, data);
    }
}

export default Renderer;