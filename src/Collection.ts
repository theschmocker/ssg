import { readdirSync } from 'fs';
import * as path from 'path';

import * as matter from 'gray-matter';

import File from './File';

class Collection {
    private _items: any[];
    
    constructor(public name: string) {
        this._items = [];
        if ( !this.collectionDirExists() ) {
            throw new Error(`Collection "${this.name}" does not exist. Create the directory "${this.collectionDirName}" in the project root`);
        }

        if ( this.collectionDirIsEmpty() ) {
            throw new Error(`Collection "${this.name}" does not have any items. Put something into "${this.collectionDirName}"!`);
        }

        this.createCollectionItems();
    }

    get collectionDirName() {
        return `_${this.name}`;
    }

    get items() {
        return this._items;
    }

    private collectionDirExists() {
        const dirnames = readdirSync('.')
        return dirnames.includes(`_${this.name}`);
    }

    private collectionDirIsEmpty() {
        const filesInCollectionDir = readdirSync('./' + this.collectionDirName);
        return filesInCollectionDir.length < 1;
    }

    private createCollectionItems() {
        return readdirSync(this.collectionDirName)
            // only support markdown files, for now
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => path.join(this.collectionDirName, fileName))
            .forEach(file => {
                File(file);
                const { data, content, excerpt } = matter.read(file)
                this._items.push({
                    content,
                    excerpt,
                    ...data
                });
            });
    }
}
    // function _createCollectionItems() {
    //     return readdirSync(this.collectionDirName)
    //         .map(fileName => new File(fileName))
    //         .filter(file => file.typeIsSupported())
    //         //.map(fileName => path.join(this.collectionDirName, fileName))
    //         .forEach(file => {
    //             const { data, content, excerpt } = file.readAndParse();
    //             this.items.push({
    //                 content,
    //                 excerpt,
    //                 ...data
    //             });
    //         });
    // }

export default Collection;