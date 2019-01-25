const { readdirSync } = require('fs');
const path = require('path');

const matter = require('gray-matter');

class Collection {
    constructor(name) {
        this.name = name;
        this.items = [];
        if ( !this._collectionDirExists() ) {
            throw new Error(`Collection "${this.name}" does not exist. Create the directory "${this.collectionDirName}" in the project root`);
        }

        if ( this._collectionDirIsEmpty() ) {
            throw new Error(`Collection "${this.name}" does not have any items. Put something into "${this.collectionDirName}"!`);
        }

        this._createCollectionItems();
    }

    get collectionDirName() {
        return `_${this.name}`;
    }

    _collectionDirExists() {
        const dirnames = readdirSync('.')
        return dirnames.includes(`_${this.name}`);
    }

    _collectionDirIsEmpty() {
        const filesInCollectionDir = readdirSync('./' + this.collectionDirName);
        return filesInCollectionDir.length < 1;
    }

    _createCollectionItems() {
        return readdirSync(this.collectionDirName)
            // only support markdown files, for now
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => path.join(this.collectionDirName, fileName))
            .forEach(file => {
                const { data, content, excerpt } = matter.read(file)
                this.items.push({
                    content,
                    excerpt,
                    ...data
                });
            });
    }
}

module.exports = Collection;