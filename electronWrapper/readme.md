# Claude for Linux MCP Setup Guide

This guide will walk you through setting up a Claude Linux wrapper with Model Context Protocol (MCP) support, which enables file system access and other extensions.

## Prerequisites

1. Node.js installed on your system
2. NPM (Node Package Manager)
3. Basic knowledge of terminal commands

## Installation Steps

### 1. Set Up the Project Structure

Create the following files in your project directory:

- `main.js`: Main Electron application file
- `preload.js`: Preload script for the Electron app
- `setup_mcp.js`: Script to manage MCP servers
- `mcp_config_editor.html`: UI for editing MCP configuration
- `package.json`: Project configuration

### 2. Install Dependencies

```bash
# Initialize a new npm project if you haven't already
npm init -y

# Install required dependencies
npm install --save-dev electron electron-builder
npm install --save electron-store
```

### 3. Add the Filesystem MCP Server

The Filesystem MCP Server allows Claude to access your local files. This is configured in the `claude_desktop_config.json` file, which will be created in your home directory under `.config/claude-linux/`.

By default, this configuration allows Claude to access your Desktop and Downloads folders. You can modify this configuration using the MCP Configuration tool in the app.

### 4. Run the Application

```bash
# Start the application
npm start
```

After starting the application, you should be able to access Claude through the Electron wrapper with MCP support enabled.

## Using MCP Features

1. Start the application
2. Go to "Developer" menu
3. Select "MCP Configuration" to edit settings
4. Save your configuration
5. Select "Restart MCP Servers" to apply changes
6. When chatting with Claude, you should see a slider ≡ icon in the bottom left of the input box
7. Click this icon to access the file system and other MCP features

## Troubleshooting

If you encounter issues with MCP functionality:

1. Check the terminal output for any error messages
2. Verify that Node.js is properly installed: `node --version`
3. Make sure the paths in your MCP configuration are correct
4. Try restarting the application after making changes
5. Check that `@modelcontextprotocol/server-filesystem` is being correctly installed by NPX

## Custom MCP Configuration

The default configuration is:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/tron/Desktop",
        "/home/tron/Downloads"
      ]
    }
  }
}
```

You can modify this to add more directories or other MCP servers.

## Security Considerations

Be aware that enabling MCP allows Claude to access files in the specified directories. Only include directories that you want Claude to be able to read from and write to.