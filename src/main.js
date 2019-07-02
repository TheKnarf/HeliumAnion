const { app, BrowserWindow } = require('electron'),
		path = require('path'),
		express = require('express'),
		bodyParser = require('body-parser');

const port = 2020;

const createWindow = (url) => {
	const size = 35;

	let win = new BrowserWindow({
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
};

const appOnPromise = (eventType) => new Promise(resolve =>
	app.on(eventType, resolve)
);

const main = async () => {
	await appOnPromise('ready');

	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	app.get('/api/status', (req, res) => {
		res.send({
			'status': 'ok'
		});	
	});

	app.post('/api/createWindow', (req, res) => {
		createWindow();
		res.send({
			'message': 'new window created'
		});
	});

	app.post('/api/open', (req, res) => {
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


	await app.listen(port);
	console.log(`Server api started on ${port}`);
};

main();

