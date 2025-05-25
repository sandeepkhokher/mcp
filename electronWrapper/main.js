const { app, BrowserWindow, Menu, shell, session, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Import MCP server setup module
const mcpSetup = require('./setup_mcp');

function createWindow() {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            partition: 'persist:claudeapp', // Persistent session storage
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js'),
            // Important for Google Auth:
            nativeWindowOpen: true,
            // Enable experimental features
            experimentalFeatures: true
        },
        icon: path.join(__dirname, 'icon.png')
    });

    // Set user agent to a standard browser to prevent detection as Electron
    mainWindow.webContents.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    // Load Claude
    mainWindow.loadURL('https://claude.ai');

    // Handle new windows properly (important for auth popups)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Allow Google auth URLs to open within the app
        if (url.includes('accounts.google.com') ||
            url.includes('anthropic.com') ||
            url.includes('claude.ai')) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    width: 800,
                    height: 600,
                    webPreferences: {
                        partition: 'persist:claudeapp' // Share the same session
                    }
                }
            };
        }

        // Open other external links in default browser
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Create application menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'Claude',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'MCP Configuration',
                    click: () => {
                        // Create MCP configuration window
                        const mcpWindow = new BrowserWindow({
                            width: 800,
                            height: 700,
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false
                            },
                            title: 'Claude MCP Configuration'
                        });
                        mcpWindow.loadFile('mcp_config_editor.html');
                    }
                },
                {
                    label: 'Edit Config File',
                    click: () => {
                        shell.openPath(mcpSetup.configPath);
                    }
                },
                {
                    label: 'Restart MCP Servers',
                    click: () => {
                        mcpSetup.stopMCPServers();
                        setTimeout(() => {
                            mcpSetup.startMCPServers();
                            dialog.showMessageBox({
                                type: 'info',
                                title: 'MCP Servers',
                                message: 'MCP Servers have been restarted.'
                            });
                        }, 1000);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Chrome DevTools',
                    click: (item, focusedWindow) => {
                        if (focusedWindow) focusedWindow.webContents.openDevTools();
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
}

// Allow specific permissions and handle cookies properly
app.whenReady().then(() => {
    // Configure session permissions
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Cross-Origin-Opener-Policy': { name: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' }
            }
        });
    });

    // Handle MCP configuration save
    ipcMain.on('save-mcp-config', (event, config) => {
        try {
            fs.writeFileSync(mcpSetup.configPath, JSON.stringify(config, null, 2));
            dialog.showMessageBox({
                type: 'info',
                title: 'Configuration Saved',
                message: `Configuration saved to ${mcpSetup.configPath}`,
                detail: 'Restart MCP servers to apply changes.'
            });
        } catch (error) {
            console.error('Failed to save MCP configuration:', error);
            dialog.showErrorBox('Save Error', `Failed to save configuration: ${error.message}`);
        }
    });

    // Start MCP servers
    mcpSetup.startMCPServers();

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Stop MCP servers on app quit
app.on('before-quit', () => {
    mcpSetup.stopMCPServers();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle GPU process crashes
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu-process-crash-limit');