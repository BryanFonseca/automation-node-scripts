#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function simpleFindDirs(searchedName, startPath = ".") {
  try {
    const dirents = await fs.readdir(startPath, {
      withFileTypes: true,
    });
    const dirs = dirents.filter((dirent) => dirent.isDirectory());
    const dirsWithModulesFolder = dirs.map(async (dir) => {
      const dirPath = path.join(startPath, dir.name);
      const hasModulesFolder = await searchModulesFolder(searchedName, dirPath);
      return {
        path: path.join(dirPath, searchedName),
        hasModulesFolder,
      };
    });
    const result = await Promise.all(dirsWithModulesFolder).then((result) => {
      return result
        .filter((directory) => directory.hasModulesFolder)
        .map((directory) => directory.path);
    });

    return result;
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

function prompt(text) {
  return new Promise((resolve) => {
    readline.question(text, (response) => {
      resolve(response);
    });
  });
}

function deleteDir(path) {
  fs.rm(path, {
    recursive: true,
    force: true,
  })
    .then(() => {
      console.log("\x1b[31m%s\x1b[0m", `${path} deleted.`);
    })
    .catch((e) => {
      console.log(e);
    });
}

async function init() {
  const response = await prompt(
    "Relative path to start searching for node_modules folders: "
  );
  const matchingPaths = await simpleFindDirs("node_modules", response.trim());

  if (!matchingPaths) {
    readline.close();
    return;
  }

  if (matchingPaths.length === 0) {
    console.log("No matching paths found.");
    readline.close();
    return;
  }

  console.log("Occurrences: ");
  matchingPaths.forEach((path) => console.log("\x1b[33m%s\x1b[0m", path));

  const confirmation = await prompt(
    `Are you sure you want to delete ${
      matchingPaths.length === 1
        ? "this folder"
        : `these ${matchingPaths.length} folders`
    }? (y/n) `
  );

  if (confirmation.toLowerCase() === "y") {
    console.log("Deleting directories...");
    matchingPaths.forEach((path) => {
      deleteDir(path);
    });
  } else {
    if (confirmation.toLowerCase() !== "n") {
      console.log("Invalid answer.");
    }
    console.log("Operation cancelled.");
  }
  readline.close();
}

init();
