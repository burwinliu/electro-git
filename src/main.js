const { app, BrowserWindow , ipcMain, dialog, screen,} = require('electron');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow

const createWindow = () => {
  // Create the browser window.
  const display = screen.getPrimaryDisplay()
  const maxiSize = display.workAreaSize

  mainWindow = new BrowserWindow({
    width: maxiSize.width*.8,
    height: maxiSize.height*.8,
    minWidth: maxiSize.width * .6,
    minHeight: maxiSize.height * .6,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })


  installExtension(REACT_DEVELOPER_TOOLS);
  installExtension(REDUX_DEVTOOLS);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


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
ipcMain.on('selectDirectory', async function(e) {
  const dir = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
  });
  e.reply('selectDirectory', dir)

});

