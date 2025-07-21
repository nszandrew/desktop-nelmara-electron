const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Para desenvolvimento, carrega o frontend do Vite
  // Em produção, substitua por: win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  //win.loadURL('http://localhost:5173');
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

  autoUpdater.checkForUpdatesAndNotify();
}

autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', () => {
  console.log('Atualização disponível!');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Atualização baixada. Instalando...');
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
  console.error('Erro ao atualizar:', err);
});

app.whenReady().then(() => {
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'nszandrew', 
    repo: 'https://github.com/nszandrew/desktop-nelmara-electron' 
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});