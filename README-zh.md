# 种子文件匹配器

## 背景

最近折腾 PT, 用了 linux 虚拟机运行 qbitorrent-nox 执行下载任务，因为 linux 的语言环境没有正确设置，[导致所有的非 ascii 字符都变成了点号](https://github.com/qbittorrent/qBittorrent/issues/16127),最后通过设置环境变量：`LANG=en_US.UTF-8` 解决了这个问题，但是已经下载的文件名都是点号了，导致 qbitorrent 包文件丢失的错误。如果一个种子下面的文件非常多，重命名就很累，所以需要一个脚本将种子文件和下载的文件夹匹配起来，然后重命名文件夹。

![demo](./media/demo.jpg)
下载后的文件夹结构如下：

```
❯ tree The.Assassin.2015.Extended -a
The.Assassin.2015.Extended
├── ......2015 .....jpg
├── ......2015 .....txt
├── [.....].The.Assassin.2015.Extended.BluRay.1080p.x264.DTS-CMCT.mkv
└── movie.nfo
```
使用脚本后的文件夹结构如下：
```

❯ node src/index.js "/Users/_/Downloads/刺客聂隐娘.加长版.2015.JPN.1080p.简繁中字￡CMCT风潇潇.torrent" "/Volumes/public_temp/download/movie/The.Assassin.2015.Extended" --dry-run
{
  _: [],
  'dry-run': true,
  d: true,
  dryRun: true,
  'rename-root': true,
  r: true,
  renameRoot: true,
  '$0': 'src/index.js',
  torrent: '/Users/_/Downloads/刺客聂隐娘.加长版.2015.JPN.1080p.简繁中字￡CMCT风潇潇.torrent',
  target: '/Volumes/public_temp/download/movie/The.Assassin.2015.Extended'
}
目标包含文件数量:4
种子名称: 刺客聂隐娘.加长版.2015.JPN.1080p.简繁中字￡CMCT风潇潇, 包含文件数量:4
目标地址包含多于文件,忽略 3618 /Volumes/public_temp/download/movie/The.Assassin.2015.Extended/movie.nfo
do rename /Volumes/public_temp/download/movie/The.Assassin.2015.Extended/......2015 .....txt -> /Volumes/public_temp/download/movie/刺客聂隐娘.加长版.2015.JPN.1080p.简繁中字￡CMCT风潇潇/刺客聂隐娘.2015 内容简介.txt
do rename /Volumes/public_temp/download/movie/The.Assassin.2015.Extended/......2015 .....jpg -> /Volumes/public_temp/download/movie/刺客聂隐娘.加长版.2015.JPN.1080p.简繁中字￡CMCT风潇潇/刺客聂隐娘.2015 蓝光海报.jpg
do rename /Volumes/public_temp/download/movie/The.Assassin.2015.Extended/[.....].The.Assassin.2015.Extended.BluRay.1080p.x264.DTS-CMCT.mkv -> /Volumes/public_temp/download/movie/刺客聂隐娘.加长版.2015.JPN.1080p.简繁中字￡CMCT风潇潇/[刺客
聂隐娘].The.Assassin.2015.Extended.BluRay.1080p.x264.DTS-CMCT.mkv

```

## 使用方法

你可以使用以下命令运行脚本：

```bash
node src/index.js <种子文件> <目标目录> [--rename-root] [--dry-run]
```

其中：

- `<种子文件>` 是种子文件的路径。
- `<目标目录>` 是种子文件对应的文件的根目录路径。
- `--rename-root` 是一个可选标志，如果设置，将会把目标根目录重命名为种子文件的名称。默认启用。
- `--dry-run` 是一个可选标志，如果设置，将不会执行任何实际操作，而是打印出将要执行的操作。默认禁用。

## 功能

脚本首先读取种子文件和目标目录，根据文件大小进行分组。然后根据文件大小和名称匹配种子文件和目标目录中的文件。如果设置了 `--rename-root` 标志，它还会将根目录重命名为种子文件的名称。

如果设置了 `--dry-run` 标志，脚本将打印出它将要执行的操作，但不会执行任何实际操作。

## 限制

必须确认种子文件里面的文件和目标目录里面的文件目录结构一致

## 依赖

此脚本需要 Node.js 和以下 npm 包：

- `yargs`
- `lodash-es`
- `fastest-levenshtein`
- `parse-torrent`

你可以使用以下命令安装这些依赖：

```bash
npm install
```

## 许可

此脚本在 MIT 许可下发布。
