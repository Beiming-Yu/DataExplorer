const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    mainWindow.loadFile(path.join(__dirname, '/html/index.html'));
    mainWindow.webContents.openDevTools();
});

ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('close-window', () => {
    mainWindow.close();
});

ipcMain.handle('get-file-path', (event, relativePath) => {
  return `file://${path.join(__dirname, relativePath)}`;
});

ipcMain.on('read-csv', (event, filePath) => {
    console.log("Reading CSV file:", filePath);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            event.reply('csv-data', '读取文件失败');
            return;
        }
        event.reply('csv-data', data);
    });
});