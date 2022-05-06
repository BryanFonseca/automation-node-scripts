#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function searchModulesFolder(searchedName, dirPath) {
  return fs
    .readdir(dirPath, {
      withFileTypes: true,
    })
    .then((dirent) => {
      const subDirs = dirent.filter((node) => node.isDirectory());
      const hasModulesFolder = !!subDirs.find(
        (dir) => dir.name === searchedName
      );
      return hasModulesFolder;
    });
}

function simpleFindDirs(searchedName, startPath = ".") {
  return fs
    .readdir(startPath, {
      withFileTypes: true,
    })
    .then((dirents) => {
      const dirs = dirents.filter((dirent) => dirent.isDirectory());
      const dirsWithModulesFolder = dirs.map((dir) => {
        const dirPath = path.join(startPath, dir.name);
        return searchModulesFolder(searchedName, dirPath).then(
          (hasModulesFolder) => {
            return {
              path: dirPath,
              hasModulesFolder,
            };
          }
        );
      });
      return Promise.all(dirsWithModulesFolder).then((result) => {
        return result
          .filter((directory) => directory.hasModulesFolder)
          .map((directory) => directory.path);
      });
    });
}

simpleFindDirs("src", "../../../node_test").then((result) => {
  console.log(result);
});
