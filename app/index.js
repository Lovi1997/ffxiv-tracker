const { ipcRenderer } = require('electron');

const updateContent = () => {
    ipcRenderer.send('updateContent', false);
};