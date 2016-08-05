const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow()
{
	mainWindow = new BrowserWindow({width: 300, height: 600, frame: false, alwaysOnTop: true, resizable: false, backgroundColor: '#111'})
	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.on('closed', function(){ mainWindow = null})
}

app.on('ready', createWindow)
