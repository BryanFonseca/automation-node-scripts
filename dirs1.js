const fs = require("fs");
const path = require("path");

//const hasModules = !!dirs.find((dir) => dir.name === "src");
function read(searchPath) {
  const nodes = fs.readdirSync(searchPath, {
    withFileTypes: true,
  });
  const dirs = nodes.filter((node) => node.isDirectory());

  const paths = [];
  dirs.forEach((dir) => {
    const dirPath = path.join(searchPath, dir.name);

    const nodes = fs.readdirSync(dirPath, {
      withFileTypes: true,
    });
    const subDirs = nodes.filter((node) => node.isDirectory());
    const hasModulesFolder = !!subDirs.find((dir) => dir.name === "src");

    if (hasModulesFolder) {
      paths.push(dirPath + '/src');
    } else {
      paths.push(...read(dirPath));
    }
  });
  return [...paths];
}

const matchingPaths = read("..");
console.log(matchingPaths);
