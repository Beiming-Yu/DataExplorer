const { app, BrowserWindow, dialog , ipcMain } = require('electron');
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
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    mainWindow.loadFile(path.join(__dirname, '/html/index.html'));
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
        const filePath = decodeURIComponent(url.replace('file:///', ''));
        console.log("File Path:", filePath);
        if (filePath.endsWith('.csv')) {
            readCSVFile(filePath);
        } else {
            mainWindow.webContents.send('csv-data', '❌ 仅支持 CSV 文件！');
        }
    });
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

ipcMain.handle('open-file-dialog', async () => {
    console.log("Open file dialog");
    const result = await dialog.showOpenDialog({
        filters: [{ name: 'CSV 文件', extensions: ['csv'] }],
        properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0].split('/').pop(); 
    }
    return null;
});

ipcMain.on('process-csv', (event, filePath) => {
    console.log("File Path:", filePath);
    if (!filePath) {
        event.reply('csv-data', 'Unkown file path');
        return;
    }
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            event.reply('csv-data', 'Failed to read file');
            return;
        }
        event.reply('csv-data', data);
    });
});