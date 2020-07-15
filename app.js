const { app, BrowserWindow, Menu } = require('electron')
const { getRepoPath } = require('./app/store/repoStore')

let window;

function createWindow () {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1050,
    height: 600,
    minWidth: 1050,
    minHeight: 600,

    webPreferences: {
      nodeIntegration: true
    }
  })
  

  // and load the index.html of the app.
  if (getRepoPath()){
    window.loadFile("./app/html/landing.html")
  }
  else{
    window.loadFile('./app/html/index.html')
  }

  // Open the DevTools.
  window.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

template = [
  {
    label: 'Developer',
    submenu:[
      {
        label:'Show Dev Menu',
        click() { 
          console.log('item 1 clicked')
          window.webContents.openDevTools()
        }
      },
    ]
    
  },
  {
    // TODO look into making dialogs for electron (with browser window maybe?)
    label: 'File',
    submenu:[
      {
        label:'Create New Repository',
        click() { 
          return;
        }
      },
      {
        label:'Add Repository',
        click() { 
          return;
        }
      },
      {
        label:'Clone Repository',
        click() { 
          return
        }
      },
    ]
    
  },
  {
    label: 'Git Settings',
    submenu:[
      {
        label:'Set User Settings',
        click() { 
          window.webContents.openDevTools()
        }
      },
      {
        label:'Set Repository Settings',
        click() { 
          window.webContents.openDevTools()
        }
      },
    ]
    
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)