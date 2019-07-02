const { app, BrowserWindow } = require('electron'),
		path = require('path'),
		process = require('process'),
		express = require('express'),
		bodyParser = require('body-parser');

const port = 2020;
let lastWindow = null;

const createWindow = (url) => {
	const size = 35;
	const win = new BrowserWindow({
		width: size * 16,
		height: size * 9,
		webPreferences: {
			nodeIntegration: true
		},
	});

	// For some reasons you need to hide it for the settings under to take effect
	// ref: https://github.com/electron/electron/issues/10078#issuecomment-386908380
	app.dock.hide();
	win.setAlwaysOnTop(true, 'floating');
	win.setVisibleOnAllWorkspaces(true, true);
	win.setFullScreenable(false);
	app.dock.show();

	if(!url) {
		win.loadFile(path.join(__dirname, 'index.html'));
	} else {
		win.loadURL(url);
	}

	lastWindow = win;
};

const appOnPromise = (eventType) => new Promise(resolve =>
	app.on(eventType, resolve)
);

const main = async () => {
	await appOnPromise('ready');

	const apiApp = express();

	apiApp.use(bodyParser.json());
	apiApp.use(bodyParser.urlencoded({extended: true}));

	apiApp.get('/api/status', (req, res) => {
		res.send({
			'status': 'ok'
		});	
	});

	apiApp.post('/api/new', (req, res) => {
		if(!req.is('application/json')) {
			return res.status(400).send({
				"message": "You need to set content type to application/json"
			});
		}

		createWindow(req.body.url);
		res.send({
			'message': 'new window created'
		});
	});

	apiApp.post('/api/open', (req, res) => {
		if(!req.is('application/json')) {
			return res.status(400).send({
				"message": "You need to set content type to application/json"
			});
		}

		if(lastWindow === null) {
			createWindow(req.body.url);
		} else {
			lastWindow.loadURL(req.body.url);
		}
		res.send({
			'message': 'new window created'
		});
	});

	apiApp.post('/api/quit', (req, res) => {
		res.send({
			'message': 'quitting...'
		});
		app.exit(0);
	});

	await apiApp.listen(port);
	console.log(`Server api started on ${port}`);
};

main();

