import { groupBy, forEach, omit } from 'lodash-es';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { closest } from 'fastest-levenshtein';

import parseTorrent from 'parse-torrent';
import fs from 'fs';
import path from 'path';

const argv = yargs(hideBin(process.argv))
  .command('$0 <torrent> <target>', 'torrent file matcher', (yargs) => {
    yargs
      .positional('torrent', {
        describe: '种子文件路径',
        type: 'string',
      })
      .positional('target', {
        describe: '种子文件对应的根目录',
        type: 'string',
      });
  })
  .option('rename-root', {
    alias: 'r',
    type: 'boolean',
    default: true,
    description: '是否重命名根目录,如果是,会将目标根目录重命名成种子name',
  })
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: '是否dry run,不执行实际操作',
  }).argv;

const { dryRun, renameRoot } = argv;
const file = argv.torrent;
const inputFile = fs.readFileSync(file);

const targetDir = argv.target;
console.log(argv);

async function getFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await getFiles(fullPath));
    } else {
      const stats = fs.statSync(fullPath);
      results.push({ path: fullPath, size: stats.size });
    }
  }

  return results;
}

Promise.all([
  getFiles(targetDir).then((files) => {
    console.log(`目标包含文件数量:${files.length}`);
    return groupBy(files, 'size');
  }),

  parseTorrent(inputFile).then((torrent) => {
    const name = torrent.name;
    const files = torrent.files;
    console.log(`种子名称: ${name}, 包含文件数量:${files.length}`);
    return {
      name,
      files: groupBy(files, 'length'),
    };
  }),
])
  .then(([targetFiles, source]) => {
    const invalidLength = [];
    forEach(targetFiles, (files, key) => {
      const s = source.files[key];
      if (s) {
        if (files.length === s.length) {
          if (files.length === 1) {
            files[0].realPath = s[0].path;
          } else {
            const cloned = [...s].map((f) => f.path);
            files.forEach((f) => {
              f.realPath = closest(f.path, cloned);
              cloned.splice(cloned.indexOf(f.realPath), 1);
            });
          }
        } else {
          console.log('files:', files);
          throw new Error('size not same,maybe losted files?');
        }
      } else {
        console.warn(
          '目标地址包含多于文件,忽略',
          key,
          files.map((f) => f.path).join(',')
        );
        invalidLength.push(key);
      }
    });
    return Object.values(omit(targetFiles, invalidLength))
      .flat(999)
      .map((f) => {
        const firstDirectory = path.dirname(f.realPath).split(path.sep)[0];
        const prefix = renameRoot ? path.dirname(targetDir) : targetDir;
        const destPath = renameRoot
          ? f.realPath
          : path.relative(firstDirectory, f.realPath);

        return {
          oldPath: f.path,
          newPath: path.join(
            // 使用 上一层的路径,因为taregetDir本身就是乱码的源头
            // 如果qbitorrent 修改过种子根目录和文件夹的关系,这个操作会导致关系被重置!!可能需要更新qbitorrent 修改根目录
            prefix,
            destPath
          ),
        };
      });
  })
  .then((files) => {
    const renameMap = {};
    if (dryRun) {
      files.forEach((file) => {
        console.log(`do rename ${file.oldPath} -> ${file.newPath}`);
      });
    } else {
      files.forEach((file) => {
        renameRecursive(file.oldPath, file.newPath, renameMap);
      });
    }
  });

const renameRecursive = (oldPath, newPath, renameMap) => {
  const oldArr = oldPath.split(path.sep);
  const newArr = newPath.split(path.sep);

  oldArr.forEach((arr, idx) => {
    if (idx > 0) {
      const oldSubPath = oldArr.slice(0, idx + 1).join(path.sep);
      const newSubPath = newArr.slice(0, idx + 1).join(path.sep);
      if (!fs.existsSync(newSubPath)) {
        const olddir = path.dirname(oldSubPath);
        const oldname = path.basename(oldSubPath);
        const newdir = renameMap[olddir];
        const newname = path.join(newdir, oldname);
        console.log(`do rename ${newname} -> ${newSubPath}`);
        fs.renameSync(newname, newSubPath);
      }
      renameMap[oldSubPath] = newSubPath;
    }
  });
};
