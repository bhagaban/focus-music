const electron = require('electron')
const {Menu} = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
const Tray = electron.Tray;
const globalShortcut = electron.globalShortcut;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 320, 
    height: 120, 
    icon: path.join(__dirname, '/icons/icon-64.png')
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  //Enable this for development
  mainWindow.webContents.openDevTools();

  //resize all the webview on the main window resize
  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getContentSize();
    for (let wc of webContents.getAllWebContents()) {
      // Check if `wc` belongs to a webview in the `win` window.
      if (wc.hostWebContents && wc.hostWebContents.id === mainWindow.webContents.id) {
        wc.setSize({ normal: { width: width, height: height } });
      }
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  
  const template = [
    {
      label: 'Menu',
      submenu: [
        {label: 'Show/Hide App', accelerator: 'CommandOrControl+Shift+Space', click: () => mainWindow.webContents.send('showhide', 'ping')},
        {label: 'Play/Pause', accelerator: 'CommandOrControl+Shift+P', click: () => mainWindow.webContents.send('playpause', 'ping')}
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  
  }
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  
  globalShortcut.register('CommandOrControl+Shift+Space', () => mainWindow.webContents.send('showhide', 'ping'));
  globalShortcut.register('CommandOrControl+Shift+P', () => mainWindow.webContents.send('playpause', 'ping'));

  globalShortcut.unregister('CommandOrControl+W');
  //globalShortcut.unregister('CommandOrControl+R');
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.