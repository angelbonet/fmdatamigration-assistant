const { app, BrowserWindow, ipcMain, dialog, shell, Notification } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let migrationProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: 'FMDataMigration Assistant',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Abrir links externos en el navegador del sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── Selección de archivos ────────────────────────────────
ipcMain.handle('browse-file', async (event, opts) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: opts.title || 'Seleccionar archivo',
    filters: opts.filters || [{ name: 'FileMaker', extensions: ['fmp12'] }],
    properties: ['openFile'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('browse-executable', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar FMDataMigration',
    properties: ['openFile'],
    filters: process.platform === 'win32'
      ? [{ name: 'Ejecutable', extensions: ['exe'] }]
      : [],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('browse-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar carpeta de plugins',
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

// ── Ejecutar migración ───────────────────────────────────
ipcMain.handle('run-migration', async (event, args) => {
  if (migrationProcess) {
    return { error: 'Ya hay una migración en curso' };
  }

  // Verificar que el ejecutable existe
  if (!fs.existsSync(args[0])) {
    return { error: `Ejecutable no encontrado: ${args[0]}` };
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';

    migrationProcess = spawn(args[0], args.slice(1), {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    migrationProcess.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      mainWindow.webContents.send('migration-log', { type: 'stdout', text });
    });

    migrationProcess.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      mainWindow.webContents.send('migration-log', { type: 'stderr', text });
    });

    migrationProcess.on('close', (code) => {
      migrationProcess = null;
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const success = code === 0;

      // Notificación nativa del SO
      if (Notification.isSupported()) {
        new Notification({
          title: success ? 'Migración completada ✓' : 'Migración fallida ✗',
          body: success
            ? `Completada en ${elapsed} segundos`
            : `Error — código de salida: ${code}`,
          urgency: success ? 'normal' : 'critical',
        }).show();
      }

      resolve({ success, code, elapsed, stdout, stderr });
    });

    migrationProcess.on('error', (err) => {
      migrationProcess = null;
      resolve({ error: err.message });
    });
  });
});

// ── Cancelar migración ───────────────────────────────────
ipcMain.handle('cancel-migration', () => {
  if (migrationProcess) {
    migrationProcess.kill('SIGTERM');
    migrationProcess = null;
    return true;
  }
  return false;
});

// ── Generar y guardar script .sh ─────────────────────────
ipcMain.handle('save-script', async (event, scriptContent) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Guardar script',
    defaultPath: 'fm_migrate.sh',
    filters: [{ name: 'Shell script', extensions: ['sh'] }],
  });
  if (result.canceled) return null;
  fs.writeFileSync(result.filePath, scriptContent, { mode: 0o755 });
  return result.filePath;
});

// ── Info de plataforma ───────────────────────────────────
ipcMain.handle('get-platform', () => process.platform);
