"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const matter = require("gray-matter");
const File_1 = require("./File");
class Collection {
    constructor(name) {
        this.name = name;
        this._items = [];
        if (!this.collectionDirExists()) {
            throw new Error(`Collection "${this.name}" does not exist. Create the directory "${this.collectionDirName}" in the project root`);
        }
        if (this.collectionDirIsEmpty()) {
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
    collectionDirExists() {
        const dirnames = fs_1.readdirSync('.');
        return dirnames.includes(`_${this.name}`);
    }
    collectionDirIsEmpty() {
        const filesInCollectionDir = fs_1.readdirSync('./' + this.collectionDirName);
        return filesInCollectionDir.length < 1;
    }
    createCollectionItems() {
        return fs_1.readdirSync(this.collectionDirName)
            // only support markdown files, for now
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => path.join(this.collectionDirName, fileName))
            .forEach(file => {
            File_1.default(file);
            const { data, content, excerpt } = matter.read(file);
            this._items.push(Object.assign({ content,
                excerpt }, data));
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
exports.default = Collection;
