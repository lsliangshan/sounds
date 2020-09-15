import { ipcMain } from 'electron'
const os = require('os')
const shelljs = require('shelljs')

const { exec } = require('child_process')

const ffmpeg = require('fluent-ffmpeg')
// const concat = require('ffmpeg-concat')
const path = require('path')

function imageToVideo (args) {
  console.log(os.tmpdir())
  return new Promise(async (resolve, reject) => {
    let ts = (new Date()).getTime()
    let fn = args.path.split(path.sep).pop().replace(/(.*)(\.[a-zA-Z0-9]*)$/, '$1')
    // let cmdStr = 'ffmpeg '
    // cmdStr += ` -t ${args.duration ? (args.duration / 1000) : 5} -loop 1 `
    // cmdStr += ` -i ${args.path} `
    // cmdStr += ` -vf scale=${args.size || '1080x?'} `
    // cmdStr += ` -y ${path.resolve(os.tmpdir(), 'enkel' + path.sep + fn + '-' + ts + '.' + (args.format || 'mp4'))}`
    // exec(cmdStr, () => {
    //   resolve(path.resolve(os.tmpdir(), 'enkel' + path.sep + fn + '-' + ts + '.' + (args.format || 'mp4')))
    // })
    ffmpeg(args.path).size(args.size || '640x?').autopad(args.autopad || 'black').videoCodec('libx264').audioBitrate(128).format(args.format || 'mp4').loop(args.duration ? (args.duration / 1000) : 5).fps(args.hasOwnProperty('fps') ? args.fps : 30).outputOptions(['-pix_fmt yuv420p', `-vf scale=${args.size ? args.size.replace(/x/, ':') : '640:480'}`]).on('error', (err) => {
      console.log('.......', err)
      resolve('')
    }).on('end', () => {
      resolve(path.resolve(os.tmpdir(), 'enkel' + path.sep + fn + '-' + ts + '.' + (args.format || 'mp4')))
    }).save(path.resolve(os.tmpdir(), 'enkel' + path.sep + fn + '-' + ts + '.' + (args.format || 'mp4')))
  })
}

ipcMain.on('gen-video', async (event, data) => {
  console.log('Images: ', data.images)
  console.log('Transitions: ', data.transitions)
  await Promise.all(data.images.map(item => imageToVideo(item))).then(async (response) => {
    let res = response.filter(item => item)
    let outPath = path.resolve(os.tmpdir(), 'enkel' + path.sep + 'test.mp4')
    // await concat({
    //   output: outPath,
    //   videos: res,
    //   transitions: data.transitions
    // })
    let cmdStr = `ffmpeg`
    for (let i = 0; i < res.length; i++) {
      cmdStr += ` -i ${res[i]} `
    }
    cmdStr += `  -stream_loop -1 -i ${data.audios[0] || '/private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/neq.mp3'} -acodec aac`
    // cmdStr += `  -stream_loop -1 -i /private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/neq.mp3 -acodec aac`
    cmdStr += ` -filter_complex "`
    let arr = []
    let tmpStr = ''
    let totalTs = 0
    for (let j = 0; j < res.length - 1; j++) {
      arr.splice(j, 0, ` [${j}]split[v_sp_${j}_0][v_sp_${j}_1];[v_sp_${j}_0]trim=0:${Math.floor(data.images[j].duration / 1000)}[v_tr_${j}_0];[v_sp_${j}_1]trim=${Number(((data.images[j].duration - data.transitions[j].duration) / 1000).toFixed(1))}:${Math.floor(data.images[j].duration / 1000)}[v_tr_${j}_1];[v_tr_${j}_1]setpts=PTS-STARTPTS[v_st_${j}];`)
      if (j > 0) {
        arr.push(` [v_st_${j - 1}][v_tr_${j}_0]gltransition=duration=${Number((data.transitions[j - 1].duration / 1000).toFixed(1))}:source=${__static}/static/transitions/${data.transitions[j - 1].name}.glsl[v${j - 1}];`)
      }
      // arr.splice(j, 0, ` [${j}]split[v_sp_${j}_0][v_sp_${j}_1];[v_sp_${j}_0]trim=0:${Math.floor(data.images[j].duration / 1000)}[v_tr_${j}_0];[v_sp_${j}_1]trim=${Math.floor((data.images[j].duration - data.transitions[j].duration) / 1000)}:${Math.floor(data.images[j].duration / 1000)}[v_tr_${j}_1];[v_tr_${j}_1]setpts=PTS-STARTPTS[v_st_${j}];`)
      // if (j > 0) {
      //   arr.push(` [v_st_${j - 1}][v_tr_${j}_0]gltransition=duration=${Math.floor(data.transitions[j - 1].duration / 1000)}:source=${__static}/static/transitions/${data.transitions[j - 1].name}.glsl[v${j - 1}];`)
      // }
      tmpStr += `[v${j}]`
      totalTs += Number(data.images[j].duration)
    }
    totalTs += Number(data.images[data.images.length - 1].duration)
    arr.push(` [v_st_${res.length - 2}][${res.length - 1}]gltransition=duration=${Number((data.transitions[res.length - 2].duration / 1000).toFixed(1))}:source=${__static}/static/transitions/${data.transitions[res.length - 2].name}.glsl[v${res.length - 2}];`)
    arr.push(` [v_tr_0_0]${tmpStr}concat=n=${res.length}[v];`)
    arr.push(` afade=t=out:st=${Math.floor(totalTs / 1000)}:d=1"`)
    cmdStr += arr.join('')
    totalTs += 1000
    // cmdStr += ` "[0]split[v_sp_0_0][v_sp_0_1];[v_sp_0_0]trim=0:5[v_tr_0_0];[v_sp_0_1]trim=3:5[v_tr_0_1];[v_tr_0_1]setpts=PTS-STARTPTS[v_st_0];`
    // cmdStr += ` [1]split[v_sp_1_0][v_sp_1_1];[v_sp_1_0]trim=0:5[v_tr_1_0];[v_sp_1_1]trim=3:5[v_tr_1_1];[v_tr_1_1]setpts=PTS-STARTPTS[v_st_1];`
    // cmdStr += ` [v_st_0][v_tr_1_0]gltransition=duration=2:source=${__static}/static/transitions/crosszoom.glsl[v0];`
    // cmdStr += ` [v_st_1][2]gltransition=duration=2:source=${__static}/static/transitions/swap.glsl[v1];`
    // cmdStr += ` [v_tr_0_0][v0][v1]concat=n=3[v];`
    // cmdStr += ` afade=t=out:st=15:d=1"`
    cmdStr += ` -map "[v]"`
    cmdStr += ` -map "${res.length}:a"`
    // cmdStr += ` -map "3:a"`
    cmdStr += ` -t ${Math.floor(totalTs / 1000)}`
    // cmdStr += ` -t 16`
    cmdStr += ` -c:v libx264`
    cmdStr += ` -profile:v main`
    cmdStr += ` -pix_fmt yuv420p`
    cmdStr += ` -preset fast`
    cmdStr += ` -y`
    cmdStr += ` ${outPath}`
    // exec(`ffmpeg -hide_banner -i  /private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/c05.mp4 -i  /private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/c06.mp4 -i  /private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/c07.mp4 -stream_loop -1 -i /private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/neq.mp3 -acodec aac -filter_complex "[0]split[v_sp_0_0][v_sp_0_1];[v_sp_0_0]trim=0:5[v_tr_0_0];[v_sp_0_1]trim=3:5[v_tr_0_1];[v_tr_0_1]setpts=PTS-STARTPTS[v_st_0];[1]split[v_sp_1_0][v_sp_1_1];[v_sp_1_0]trim=0:5[v_tr_1_0];[v_sp_1_1]trim=3:5[v_tr_1_1];[v_tr_1_1]setpts=PTS-STARTPTS[v_st_1];[v_st_0][v_tr_1_0]gltransition=duration=2:source=${__static}/static/transitions/fade.glsl[v0];[v_st_1][2]gltransition=duration=2:source=${__static}/static/transitions/circleopen.glsl[v1];[v_tr_0_0][v0][v1]concat=n=3[v];afade=t=out:st=15:d=1" -map "[v]" -map "3:a" -t 16 -c:v libx264 -profile:v main -pix_fmt yuv420p -preset fast -y /private/var/folders/6z/yyk4dr6x1yzd_3kpxc1p5lmr0000gn/T/enkel/out5.mp4`, () => {
    //   console.log('...222222....')
    // })
    console.log(cmdStr)
    exec(cmdStr, () => {
      console.log('#######')
    })
    // for (let j = 0; j < res.length; j++) {
    //   cmdStr += `[${j}]split[v_sp_${j}_0][v_sp_${j}_1];[v_sp_${j}_0]trim=0:${data.images[j].duration}[v_tr_${j}_0];[v_sp_${j}_1]trim=${data.images[j].duration - data.transitions[j].duration}:${data.images[j].duration}[v_tr_${j}_1];[v_tr_${j}_1]setpts=PTS-STARTPTS[v_st_${j}];`
    // }
    // for (let z = 0; z < res.length; z++) {
    //   cmdStr += `[v_st_${z}][v_tr_${z + 1}_0]gltransition=duration=${data.transitions[z].duration};`
    // }
    event.reply('response-gen-video', {
      path: outPath
    })
  })
})