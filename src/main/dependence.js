import { ipcMain } from 'electron'
import shelljs from 'shelljs'

ipcMain.on('check-dependence', (event, params) => {
  if (!!shelljs.which(params.name)) {
    event.returnValue = {
      code: 200,
      message: '成功'
    }
  } else {
    event.returnValue = {
      code: 404,
      message: params.name + '命令不存在'
    }
  }
})

ipcMain.on('install-cmd', (event, params) => {

})