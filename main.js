const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

require('electron-reload')(__dirname, {
  electron: require('electron-prebuilt')
});

devtools = require('electron-devtools-installer');
REACT_DEVELOPER_TOOLS = devtools.REACT_DEVELOPER_TOOLS;
//import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

devtools.default(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred when adding React developer tools: ', err));

let mainWindow

function createWindow()
{	
	var mainWindow;

	if(process.argv.indexOf('--dev') >= 0)
	{
		mainWindow = new BrowserWindow({width: 1200, height: 600, frame: false, alwaysOnTop: true, resizable: true})
		mainWindow.webContents.openDevTools()
	}
	else
	{
		mainWindow = new BrowserWindow({width: 300, height: 600, frame: false, alwaysOnTop: true, resizable: false})
	}

	mainWindow.loadURL(`file://${__dirname}/pages/index.html`)
	mainWindow.on('closed', function(){mainWindow = null})
}

app.on('ready', createWindow)
