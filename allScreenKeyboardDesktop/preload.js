// ---------- preload.js ----------
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('svgConverter', {
  convertSvg: (markup) => ipcRenderer.invoke('convertSvg', markup),
});

contextBridge.exposeInMainWorld('fontAPI', {
  getGlyphs: () => ipcRenderer.invoke('get-glyphs'),
  uploadFont: () =>ipcRenderer.invoke('uploadFont'),
  saveFont: () =>ipcRenderer.invoke('saveFont'),
  getFontNames: () =>ipcRenderer.invoke('getFontNames'),
  getFontCharacterNames: (arg) =>ipcRenderer.invoke('getFontCharacterNames',arg)
});

contextBridge.exposeInMainWorld('keyApi', {
  getActiveKey: () => ipcRenderer.invoke('getActiveKey'),
  setActiveKey: (arg) =>ipcRenderer.invoke('setActiveKey',arg),
});

contextBridge.exposeInMainWorld('pageApi', {
  changePage: (arg) => ipcRenderer.invoke('changePage',arg),
});

contextBridge.exposeInMainWorld('profileApi', {
  createProfile: (arg) => ipcRenderer.invoke('createProfile',arg),
  savePng: (arg) => ipcRenderer.invoke('saveCanvasImage', arg),
  uploadProfile: (arg) => ipcRenderer.invoke('uploadProfile',arg),
  saveProfile: (arg) => ipcRenderer.invoke('saveCanvasImage', arg),
  sendFile: (arg) => ipcRenderer.invoke('sendFile', arg),
  getStillEditing: (arg) => ipcRenderer.invoke('getStillEditing', arg),
  editProfile: (arg) => ipcRenderer.invoke('editProfile', arg),
  addImage: (arg) => ipcRenderer.invoke('addImage', arg)
});



