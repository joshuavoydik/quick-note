const { app, BrowserWindow, ipcMain } = require('electron')
const electronLocalshortcut = require('electron-localshortcut');
const fs = require('fs');
const path = require('path');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: true
  })

  win.loadFile('index.html')

  electronLocalshortcut.register(win, 'Control+Option+Command+N', () => {
    win.show();
    win.focus();
  });
  
  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });
}

ipcMain.on('save-note', (event, note) => {
  const noteWithNewline = `${note}\n`;
  fs.appendFileSync(path.join(__dirname, 'notes', 'notes.txt'), noteWithNewline);
  event.reply('note-saved', 'Note saved successfully');
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})



