const fs = require("fs");
const path = require("path");

function read(searchPath, result) {
  //console.log(searchPath);
  const nodes = fs.readdirSync(searchPath, {
    withFileTypes: true,
  });

  /*   nodes.forEach((node) => {
    console.log(`${node.name} is directory: ${node.isDirectory()}`);
  }); */

  const dirs = nodes.filter((node) => node.isDirectory());

  const hasModules = !!dirs.find((dir) => dir.name === "src");
  if (hasModules) {
    // base case happens when node_modules dir is inside the currently reading directory
    //console.log(searchPath);
    //console.log('reading', searchPath, 'src');
    result.push(searchPath);
    //console.log(result);

/*     fs.rm(path.join(searchPath, 'node_modules'),{
      force: true,
      recursive: true,
    }).then(() => {
      console.log('deleted!');
    }) */
    //console.log(`found node_modules on ${searchPath}`);
    return;
  } else {
    dirs.forEach((dir) => {
      read(path.join(searchPath, dir.name), result);
    });
  }
  //console.log(path.dirname())

  //console.log(dirs);

  //const dirs = nodes.find((node) => node.isDirectory() && node.name === 'node_modules');
}

// pass repos path
const arr = [];
read("..", arr);
console.log(arr);
