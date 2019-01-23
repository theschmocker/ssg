const { readdir } = require('./util/fs-promise');

class Collection {
    async constructor(name) {
        this.name = name;
        this.items = [];
        if ( !(await this._collectionDirExists()) ) {
            throw new Error(`Collection "${this.name}" does not exist. Create the directory "${this.collectionDirName}" in the project root`);
        }

        if ( await this._collectionDirIsEmpty() ) {
            console.log();
            throw new Error(`Collection "${this.name}" does not have any items. Put something into "${this.collectionDirName}"!`);
        }
    }

    get collectionDirName() {
        return `_${this.name}`;
    }

    async _collectionDirExists() {
        const dirnames = await readdir('.')
        return dirnames.includes(`_${this.name}`);
    }

    async _collectionDirIsEmpty() {
        const filesInCollectionDir = await readdir('./' + this.collectionDirName);
        return filesInCollectionDir.length < 1;
    }

    async _createCollectionItems() {
        return (await readdir(this.collectionDirName))
            // only support markdown files, for now
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => path.join(collectionDir, fileName))
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