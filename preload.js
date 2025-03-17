const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded!");

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),
    receiveFromMain: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});

