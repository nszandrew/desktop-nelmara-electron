const { contextBridge } = require('electron');

// Expor informações do ambiente para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  isDev: process.env.NODE_ENV === 'development' || !require('electron').app.isPackaged,
  platform: process.platform,
  versions: process.versions
});

// Log para debug
console.log('🔧 Preload - NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 Preload - isDev:', process.env.NODE_ENV === 'development' || !require('electron').app.isPackaged);