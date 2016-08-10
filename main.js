const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

require('electron-reload')(__dirname, {
  electron: require('electron-prebuilt')
});

let mainWindow

function createWindow()
{	
	var mainWindow;

	if(process.argv.indexOf('--dev') >= 0)
	{
		mainWindow = new BrowserWindow({frame: false, alwaysOnTop: true, resizable: true})
		mainWindow.maximize();
		mainWindow.webContents.openDevTools()

		devtools = require('electron-devtools-installer');
		REACT_DEVELOPER_TOOLS = devtools.REACT_DEVELOPER_TOOLS;
		devtools.default(REACT_DEVELOPER_TOOLS)
	}
	else
	{
		mainWindow = new BrowserWindow({width: 400, height: 560, frame: false, alwaysOnTop: true, resizable: false})
	}

	mainWindow.loadURL(`file://${__dirname}/pages/index.html`)
	mainWindow.on('closed', function(){mainWindow = null})
}

app.on('ready', createWindow)
