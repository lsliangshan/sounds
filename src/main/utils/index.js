const fs = require('fs')
const path = require('path')
const compressing = require('compressing')
const shelljs = require('shelljs')
const os = require('os')

export function walk (dir, filter = '') {
  /**
   * 文件遍历
   * filter: 支持 * 通配符，如 *.js
   */
  return new Promise(async (resolve, reject) => {
    let outFiles = []
    const filterRegExp = new RegExp(filter.replace(/([. ])/g, '\\$1').replace(/\*/g, '.{0,}'), 'i')
    let filePath = ''
    let stat = ''
    let _dir = dir
    if (dir.split('.').pop() == 'zip') {
      await uncompress(dir, path.resolve(os.tmpdir(), 'enkel' + path.sep + (dir.split(path.sep).pop().split('.')[0]) + '-' + (new Date()).getTime())).then(r => {
        _dir = r
      }).catch(() => {
        _dir = dir
      })
    }
    let dirStat = fs.statSync(_dir)
    if (dirStat.isDirectory()) {
      fs.readdirSync(_dir).forEach(name => {
        filePath = path.resolve(_dir, name)
        stat = fs.statSync(filePath)
        if (name.match(filterRegExp) && stat.isFile()) {
          outFiles.push(filePath)
        }
      })
    } else if (dirStat.isFile()) {
      if (dir.match(filterRegExp)) {
        outFiles.push(dir)
      }
    }
    resolve(outFiles)
  })
}

export function walks (dirs, type) {
  return new Promise(async (resolve, reject) => {
    let _filter = ''
    switch (type) {
      case 'image':
        _filter = '(*.jpg)|(*.png)|(*.jpeg)|(*.bmp)'
        break
      case 'audio':
        _filter = '(*.wav)|(*.m3u)|(*.mp3)|(*.flac)'
        break
      case 'video':
        _filter = '(*.avi)|(*.mp4)'
        break
      default:
        break
    }
    await Promise.all(dirs.map(item => walk(item.path, _filter))).then(res => {
      resolve([].concat.apply([], res))
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

export function uncompress (file, dest = '.' + path.sep, format = 'zip') {
  // 解压
  return new Promise((resolve, reject) => {
    if (['tar', 'gzip', 'gz', 'tgz', 'zip'].indexOf(format) < 0) {
      reject(new Error(`${format}格式暂不支持`))
    }
    compressing[format].uncompress(file, dest).then(res => {
      if (fs.existsSync(path.resolve(dest, '.' + path.sep + '__MACOSX'))) {
        shelljs.rm('-rf', path.resolve(dest, '.' + path.sep + '__MACOSX'))
      }
      resolve(path.resolve(dest, '.' + path.sep + ''))
    }).catch(err => {
      reject(new Error(err.message))
    })
  })
}

export function compress (files = [], dest = '.' + path.sep, filename = '', format = 'zip') {
  // 压缩
  return new Promise(async (resolve, reject) => {
    if (filename) {
      format = filename.split('.').pop()
    }
    if (['tar', 'tgz', 'zip'].indexOf(format) < 0) {
      reject(new Error(`${format}格式暂不支持`))
    }
    let rn = path.resolve(dest, '.' + path.sep + (filename || ('归档.' + format)))
    const fileStream = new compressing[format].Stream()
    files.forEach(item => {
      fileStream.addEntry(item)
    })
    const destStream = fs.createWriteStream(rn)
    pipe(fileStream, destStream, (err) => {
      if (err) {
        reject(new Error(err.message))
      } else {
        resolve({
          path: rn,
          code: 200
        })
      }
    })
  })
}
