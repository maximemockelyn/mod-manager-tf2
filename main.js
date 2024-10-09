const remoteMain = require('@electron/remote/main')
remoteMain.initialize()

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { pathToFileURL }                 = require('url')

const appExpress = express();
appExpress.set('view engine', 'ejs');
appExpress.set('views', path.join(__dirname, 'app/views'));
appExpress.use(express.static(path.join(__dirname, 'assets')));

require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

app.disableHardwareAcceleration()

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const appVersion = packageJson.version;



// Route pour la page principale
appExpress.get('/', (req, res) => {
    res.render('app', { bkid: '1', version: appVersion });  // Passer des variables si nécessaire
});

// Démarrer le serveur Express sur un port spécifique
const server = appExpress.listen(3000, () => {
    console.log('Serveur Express démarré sur le port 3000');
});


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 980,
        height: 552,
        frame: false,
        backgroundColor: '#171614',
        webPreferences: {
            preload: path.join(__dirname, 'preloader.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    console.log(path.join(__dirname, 'preloader.js'));
    remoteMain.enable(mainWindow.webContents)
    mainWindow.webContents.openDevTools();

    mainWindow.loadURL('http://localhost:3000');
    mainWindow.removeMenu()
    mainWindow.resizable = true

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function createMenu() {

    if(process.platform === 'darwin') {

        // Extend default included application menu to continue support for quit keyboard shortcut
        let applicationSubMenu = {
            label: 'Application',
            submenu: [{
                label: 'About Application',
                selector: 'orderFrontStandardAboutPanel:'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => {
                    app.quit()
                }
            }]
        }

        // New edit menu adds support for text-editing keyboard shortcuts
        let editSubMenu = {
            label: 'Edit',
            submenu: [{
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                selector: 'undo:'
            }, {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                selector: 'redo:'
            }, {
                type: 'separator'
            }, {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:'
            }, {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            }, {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            }, {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                selector: 'selectAll:'
            }]
        }

        // Bundle submenus into a single template and build a menu object with it
        let menuTemplate = [applicationSubMenu, editSubMenu]
        let menuObject = Menu.buildFromTemplate(menuTemplate)

        // Assign it to the application
        Menu.setApplicationMenu(menuObject)

    }

}

app.whenReady().then(createWindow);
app.whenReady().then(createMenu);

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})