const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow()
{
	debug = false;
	var mainWindow;

	if(debug)
	{
		mainWindow = new BrowserWindow({width: 1200, height: 600, frame: false, alwaysOnTop: true, resizable: true, backgroundColor: '#111'})	
		mainWindow.webContents.openDevTools()

	}
	else
	{
		mainWindow = new BrowserWindow({width: 300, height: 600, frame: false, alwaysOnTop: true, resizable: false, backgroundColor: '#111'})
	}

	mainWindow.loadURL(`file://${__dirname}/pages/index.html`)
	mainWindow.on('closed', function(){ mainWindow = null})
}

app.on('ready', createWindow)
