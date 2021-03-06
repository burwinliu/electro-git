'use strict'

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { GitHelper } = require('./services/gitServices')
const path = require('path')
const url = require('url')
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// Test conflict
let mainWindow, gitObj;

// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  gitObj = new GitHelper();

  // and load the index.html of the app.
  let indexPath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.unmaximize()
    mainWindow.webContents.openDevTools()
    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      
    }
  })

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('isMaximize', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('isMaximize', false)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Menu Controls for the windowcontrols (in menu items)
ipcMain.on('closeWindow', function(e) {
  if(mainWindow !== null){
    mainWindow.close()
  }
});

ipcMain.on('toggleMaxWindow', function(e) {
  if(mainWindow !== null){
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
});

ipcMain.on('minWindow', function(e) {
  if(mainWindow !== null){
    mainWindow.minimize()
  }
});
//hold the array of directory paths selected by user (for opening a dialog)
ipcMain.on('selectDirectoryCustomField', async function(e) {
  const dir = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
  });
  e.reply('selectDirectoryCustomField', dir)

});

ipcMain.on('selectFileCustomField', async function(e) {
  const dir = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile']
  });
  e.reply('selectFileCustomField', dir)

});

ipcMain.on('openInFileExplorer', (e, path) => {
  e.preventDefault();
  const replaceSlash = /\//g
  let parsed

  if (process.platform === 'win32') parsed = path.replace(replaceSlash, "\\")
  else parsed = path

  shell.showItemInFolder(parsed);
})

ipcMain.on('addToGitIgnore', async (e, repoPath, payload) => {
  e.preventDefault();
  const replaceSlash = /\//g
  let path
  if (repoPath.slice(-1) != "/"){
    path = repoPath + "/"
  }
  else{
    path = repoPath
  }
  let parsed

  if (process.platform === 'win32') parsed = path.replace(replaceSlash, "\\")
  else parsed = path
  fs.appendFile(parsed + ".gitignore", "\n" + payload, (err) =>{
    if(err) {
      console.log(err)
    }
    return;
  }); 
})

// ipcMain.on('gitInitRepo', (e, repoPath) => {
//   e.preventDefault();
//   gitObj.setRepoPath(repoPath)
//   gitObj.openRepo()
// })

// ipcMain.on('gitCreateRepo', (e, repoPath) => {
//   e.preventDefault();
//   gitObj.setRepoPath(repoPath)
//   gitObj.initRepo()
// })

// ipcMain.on('gitCloneRepo', (e, repoPath, url) => {
//   e.preventDefault();
//   gitObj.setRepoPath(repoPath)
//   gitObj.cloneRepo(url)
// })

// ipcMain.on('gitFetch', (e) =>{
//   e.preventDefault();
//   gitObj.fetch();
// })

// ipcMain.on('gitStatus', (e) => {
//   const status = gitObj.getStatus()
//   e.reply('gitStatus', status)
// })