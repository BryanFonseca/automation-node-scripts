const fs = require("fs/promises");
const path = require("path");

async function simpleFindDirs(searchedName, startPath = ".") {
  const total = [];
  try {
    const dirents = await fs.readdir(startPath, {
      withFileTypes: true,
    });
    const dirs = dirents.filter((dirent) => dirent.isDirectory());
    const dirsWithModulesFolder = dirs.map(async (dir) => {
      const dirPath = path.join(startPath, dir.name);
      const hasModulesFolder = await searchModulesFolder(searchedName, dirPath);

      if (!hasModulesFolder) {
        const newDirs = await simpleFindDirs(searchedName, dirPath);
        total.push(...newDirs);
      } else {
        total.push(dirPath + `/${searchedName}`);
      }

      return {
        path: path.join(dirPath, searchedName),
        hasModulesFolder,
      };
    });
    await Promise.all(dirsWithModulesFolder);
    return total;
  } catch (error) {
    console.log(
      "There was an error. Make sure to enter a valid relative path."
    );
  }
}

async function searchModulesFolder(searchedName, dirPath) {
  const dirent = await fs.readdir(dirPath, {
    withFileTypes: true,
  });
  const subDirs = dirent.filter((node) => node.isDirectory());
  const hasModulesFolder = !!subDirs.find((dir) => dir.name === searchedName);
  return hasModulesFolder;
}

async function init() {
  const results = await simpleFindDirs("src", "../../../../node_test");
  console.log(results);
}

init();
