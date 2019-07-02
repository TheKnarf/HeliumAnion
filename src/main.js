const { app, BrowserWindow } = require('electron'),
		path = require('path');

function createWindow () {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// For some reasons you need to hide it for the settings under to take effect
	// ref: https://github.com/electron/electron/issues/10078#issuecomment-386908380
	app.dock.hide();
	win.setAlwaysOnTop(true, 'floating')
	win.setVisibleOnAllWorkspaces(true, true);
	win.setFullScreenable(false);
	app.dock.show();

	win.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', createWindow);

