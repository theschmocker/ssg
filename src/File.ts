import * as path from 'path';
import * as matter from 'gray-matter';

const SUPPORTED_FILE_TYPES = [
    'md',
    'markdown',
    'html'
];

interface File {
    data: any,
    content: string,
    excerpt: string | undefined,
}

class MarkdownFile implements File {
    private _data = {};
    private _content: string
    private _excerpt: string | undefined;

    constructor(public path: string) {
        const { data, content, excerpt } = matter.read(path);
        this._data = data;
        this._content = content;
        this._excerpt = excerpt;
    }

    get data() {
        return this._data;
    }

    get content() {
        return this._content;
    }

    get excerpt() {
        return this._excerpt;
    }
}

class FileFactory {
    static buildFile(filePath: string) {
        const extension = path.parse(filePath).ext.slice(1);
        if (!SUPPORTED_FILE_TYPES.includes(extension)) {
            throw new Error(`File type of "${filePath} is unsupported"`);
        }

        if (extension === 'md' || extension === 'Markdown') {
            return new MarkdownFile(filePath);
        }

        if (extension === 'html') {
            throw new Error(`Support for HTML data files is not implemented`);
        }
    }
}

export default FileFactory;