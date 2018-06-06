var fs = require("fs");

const createDir = (dir) => {
    // This will create a dir given a path such as "./folder/subfolder" 
    const splitPath = dir.split("/");
    splitPath.reduce((path, subPath) => {
        let currentPath;
        if (subPath != ".") {
            currentPath = path + "/" + subPath;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
        }
        else {
            currentPath = subPath;
        }
        return currentPath
    }, "")
}

module.exports = createDir;