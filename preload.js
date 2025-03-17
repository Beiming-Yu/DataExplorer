const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded!");

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    processCSV: (fileName) => ipcRenderer.send('process-csv', fileName),
    receiveFromMain: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});

