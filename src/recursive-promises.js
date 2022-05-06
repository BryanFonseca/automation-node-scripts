#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function simpleFindDirs(searchedName, startPath = ".") {
  const dirents = await fs.readdir(startPath, {
    withFileTypes: true,
  });
  const dirs = dirents.filter((dirent) => dirent.isDirectory());
  const dirsWithModulesFolder = dirs.map(async (dir) => {
    const dirPath = path.join(startPath, dir.name);
    const hasModulesFolder = await searchModulesFolder(searchedName, dirPath);
    return {
      path: dirPath,
      hasModulesFolder,
    };
  });
  const result = await Promise.all(dirsWithModulesFolder).then((result) => {
    return result
      .filter((directory) => directory.hasModulesFolder)
      .map((directory) => directory.path);
  });

  return result;
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
  const results = await simpleFindDirs("src", "../../");
  results.forEach((result) => console.log(result));
}

init();
