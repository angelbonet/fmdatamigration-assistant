const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Diálogos de selección
  browseFile: (opts) => ipcRenderer.invoke('browse-file', opts),
  browseExecutable: () => ipcRenderer.invoke('browse-executable'),
  browseFolder: () => ipcRenderer.invoke('browse-folder'),

  // Ejecución
  runMigration: (args) => ipcRenderer.invoke('run-migration', args),
  cancelMigration: () => ipcRenderer.invoke('cancel-migration'),
  onMigrationLog: (callback) => ipcRenderer.on('migration-log', (event, data) => callback(data)),
  removeMigrationLogListener: () => ipcRenderer.removeAllListeners('migration-log'),

  // Script
  saveScript: (content) => ipcRenderer.invoke('save-script', content),

  // Info
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // Abrir enlaces externos
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});
