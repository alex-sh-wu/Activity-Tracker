const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win

//type in './node_modules/.bin/electron .' on cmd to run electron

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1000,
    minHeight: 700
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'html/utrack.html'),
    protocol: 'file',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
