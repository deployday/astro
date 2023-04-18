// @ts-nocheck
import fs from 'node:fs';
import { writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function copyFromBuild({ dest }) {
  const filesToProcess = [];
  const recurseFiles = async (directory) => {
    // console.log('%%%%% reading ' + directory);
    const f = await readdir(directory, {
      withFileTypes: true,
    });

    for (const file of f) {
      console.log('#####', file);
      if (file?.isDirectory()) {
        const nextDirectory = path.join(directory, file.name);
        await recurseFiles(nextDirectory);
      } else {
        const ext = path.parse(file.name).ext;
        // console.log('FOUND EXTENSION ' + ext);

        const sourcePath = path.join(directory, file.name);
        const destPath = path.join(dest, file.name);

        switch (ext) {
          case '.jpg':
          case '.jpeg':
          case '.png':
          case '.avif':
          case '.webp':
            console.log(destPath, sourcePath, '1111!!!!');
            fs.copyFile(sourcePath, destPath, (err) => {
              if (err) console.log(err, ' but do nothing about it');
            });
            break;
        }
      }
    }
  };
  const doWork = async (dir) => {
    return new Promise((resolve) =>
      setTimeout(async () => {
        const directory = fileURLToPath(new URL(`./_astro`, dir));
        // console.log('======', directory);
        // console.log('!!!!!!!', dest);
        await recurseFiles(directory);
        resolve();
      }, 2000)
    );
  };
  return {
    name: 'asdasdasdasd',
    hooks: {
      'astro:build:generated': async ({ dir }) => {
        const directory = fileURLToPath(new URL(`./_astro`, dir));
        // console.log('======', directory);
        // console.log('!!!!!!!', dest);
        await recurseFiles(directory);

        // return doWork(dir);
      },
    },
  };
}
