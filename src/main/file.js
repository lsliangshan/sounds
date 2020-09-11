import { ipcMain } from 'electron'
import { walks, uncompress } from './utils/index'

ipcMain.on('get-files', (event, params) => {
  /**
   * params:
   *  - dirs
   *  - type: image/audio/video
   *  - filter: *.js 或 *.png，type与filter同时只能设置一个，type优先级高于filter
   */
  walks(params.dirs, 'image').then(res => {
    event.reply('response-get-files', res)
  }).catch(err => {
    console.log('EEEEERROR')
  })
})
