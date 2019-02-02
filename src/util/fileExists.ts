import fsPromise from './fs-promise';

const { access, constants } = fsPromise;

/**
 * Uses fs.access to determine whether or not a file exists
 * @param  {string} fileName - the filename (or path) to be checked for existence
 * @return {Promise} A promise that resolves to true or false, depending on whether or not the file exists
 */
async function fileExists(fileName: string): Promise<boolean> {
    try {
        await access(fileName, constants.F_OK);
        return true;
    } catch (e) {
        return false
    }
}

export default fileExists;