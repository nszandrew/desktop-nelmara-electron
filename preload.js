const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Adicione funções que o renderer pode chamar, se necessário
});