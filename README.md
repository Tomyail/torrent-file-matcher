# Torrent File Matcher | [中文简介](./README-zh.md)

## Background

Recently, I've been tinkering with PT, using a Linux virtual machine to run qbitorrent-nox for download tasks. Due to incorrect language environment settings in Linux, [all non-ascii characters turned into dots](https://github.com/qbittorrent/qBittorrent/issues/16127). This issue was resolved by setting the environment variable: `LANG=en_US.UTF-8`. However, the filenames of already downloaded files are now dots, causing qbitorrent to report missing files. If a torrent has many files, renaming them can be tedious. Therefore, a script is needed to match the torrent file with the downloaded folder, and then rename the folder.

![demo](./media/demo.jpg)
The structure of the downloaded folder is as follows:

```
❯ tree The.Assassin.2015.Extended -a
The.Assassin.2015.Extended
├── ......2015 .....jpg
├── ......2015 .....txt
├── [.....].The.Assassin.2015.Extended.BluRay.1080p.x264.DTS-CMCT.mkv
└── movie.nfo
```

The structure of the folder after using the script is as follows:

```
// The script command and output are omitted for brevity
```

## Usage

You can run the script with the following command:

```bash
node src/index.js <torrent file> <target directory> [--rename-root] [--dry-run]
```

Where:

- `<torrent file>` is the path to the torrent file.
- `<target directory>` is the root directory path of the files corresponding to the torrent file.
- `--rename-root` is an optional flag. If set, the target root directory will be renamed to the name of the torrent file. Enabled by default.
- `--dry-run` is an optional flag. If set, no actual operations will be performed, but the operations to be performed will be printed out. Disabled by default.

## Function

The script first reads the torrent file and target directory, grouping by file size. Then it matches the files in the torrent file and target directory based on file size and name. If the `--rename-root` flag is set, it will also rename the root directory to the name of the torrent file.

If the `--dry-run` flag is set, the script will print out the operations it will perform, but will not perform any actual operations.

## Limitations

The file directory structure inside the torrent file and the target directory must be confirmed to be consistent.

## Dependencies

This script requires Node.js and the following npm packages:

- `yargs`
- `lodash-es`
- `fastest-levenshtein`
- `parse-torrent`

You can install these dependencies with the following command:

```bash
npm install
```

## License

This script is released under the MIT license.

This script is used to match torrent files with their corresponding root directories. It uses the `yargs` library to parse command line arguments, `lodash-es` for utility functions, `fastest-levenshtein` for string comparison, and `parse-torrent` to parse torrent files.

## Usage

You can run the script with the following command:

```bash
node src/index.js <torrent> <target> [--rename-root] [--dry-run]
```

Where:

- `<torrent>` is the path to the torrent file.
- `<target>` is the path to the root directory of the files corresponding to the torrent.
- `--rename-root` is an optional flag that, if set, will rename the target root directory to the name of the torrent. This is enabled by default.
- `--dry-run` is an optional flag that, if set, will not perform any actual operations, but will instead print out what would have been done. This is disabled by default.

## Functionality

The script first reads the torrent file and the target directory, grouping files by their size. It then matches files in the torrent with files in the target directory based on their size and name. If the `--rename-root` flag is set, it will also rename the root directory to match the name of the torrent.

If the `--dry-run` flag is set, the script will print out what it would have done, but will not perform any actual operations.

## Limitations

The script assumes that all files in the torrent and the target directory are unique in size. If there are multiple files with the same size, it may not correctly match them.

## Dependencies

This script requires Node.js and the following npm packages:

- `yargs`
- `lodash-es`
- `fastest-levenshtein`
- `parse-torrent`

You can install these dependencies with the following command:

```bash
npm install
```

## License

This script is released under the MIT License.

