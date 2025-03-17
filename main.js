const { app, BrowserWindow, dialog , ipcMain, session} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
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

ipcMain.handle('open-file-dialog', async (event) => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: 'CSV file', extensions: ['csv'] }],
        properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        console.log("Chosen Path:", result.filePaths[0]);
        readCSVFile(result.filePaths[0]);
    }
});

ipcMain.on('process-csv', (event, filePath) => {
    console.log("Dropped Path:", filePath);
    readCSVFile(filePath);
});

function readCSVFile(filePath) {
    console.log("File Path:", filePath);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            mainWindow.webContents.send('csv-data', 'Failed to read file');
            return;
        }
        mainWindow.webContents.send('csv-data', data);
    });
};