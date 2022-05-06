#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function findDirs(searchedName, startPath = ".") {
  try {
    const nodes = fs.readdirSync(startPath, {
      withFileTypes: true,
    });
    const dirs = nodes.filter((node) => node.isDirectory());

    const paths = [];
    dirs.forEach((dir) => {
      const dirPath = path.join(startPath, dir.name);

      const nodes = fs.readdirSync(dirPath, {
        withFileTypes: true,
      });
      const subDirs = nodes.filter((node) => node.isDirectory());
      const hasModulesFolder = !!subDirs.find(
        (dir) => dir.name === searchedName
      );

      if (hasModulesFolder) {
        paths.push(dirPath + `/${searchedName}`);
      } else {
        paths.push(...findDirs(searchedName, dirPath));
      }
    });
    return [...paths];
  } catch (e) {
    console.log("Error searching, make sure to use a valid relative path.");
  }
}

function prompt(text) {
  return new Promise((resolve) => {
    readline.question(text, (response) => {
      resolve(response);
    });
  });
}

function deleteDir(path) {
  fs.rm(
    path,
    {
      recursive: true,
      force: true,
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("\x1b[31m", `${path} deleted.`);
    }
  );
}

async function init() {
  const response = await prompt(
    "Relative path to start searching for node_modules folders: "
  );
  const matchingPaths = findDirs("node_modules", response.trim());

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
