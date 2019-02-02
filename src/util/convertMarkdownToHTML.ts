import * as remark from 'remark';
import * as html from 'remark-html';

/**
 * @param  {string} markdown - The markdown content to be converted
 * @returns {Promise} A promise with the converted HTML content
 */
function convertMarkdownToHTML(markdown: string): Promise<string> {
    return new Promise((resolve, reject) => {
        remark()
            .use(html)
            .process(markdown, (err, file) => {
                if (err) reject(err);

                resolve(file.contents);
            })
    })
}

export default convertMarkdownToHTML;