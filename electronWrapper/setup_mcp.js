// setup_mcp.js
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Configuration paths
const homeDir = os.homedir();
const configDir = path.join(homeDir, '.config', 'claude-linux');
const configPath = path.join(configDir, 'claude_desktop_config.json');

// Create config directory if it doesn't exist
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// Default configuration with filesystem MCP server
const defaultConfig = {
    mcpServers: {
        filesystem: {
            command: 'npx',
            args: [
                '-y',
                '@modelcontextprotocol/server-filesystem',
                path.join(homeDir, 'Desktop'),
                path.join(homeDir, 'Downloads')
            ]
        }
    }
};

// Write default config if it doesn't exist
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`Created default configuration at ${configPath}`);
} else {
    console.log(`Configuration already exists at ${configPath}`);
}

// Function to start MCP servers
function startMCPServers() {
    try {
        // Read configuration
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const { mcpServers } = config;

        if (!mcpServers) {
            console.log('No MCP servers configured');
            return;
        }

        // Start each configured server
        Object.entries(mcpServers).forEach(([name, server]) => {
            const { command, args } = server;

            console.log(`Starting MCP server: ${name}`);
            console.log(`Command: ${command} ${args.join(' ')}`);

            const process = spawn(command, args, {
                stdio: 'pipe',
                detached: false
            });

            process.stdout.on('data', (data) => {
                console.log(`[${name}] ${data.toString().trim()}`);
            });

            process.stderr.on('data', (data) => {
                console.error(`[${name}] ERROR: ${data.toString().trim()}`);
            });

            process.on('close', (code) => {
                console.log(`[${name}] process exited with code ${code}`);
            });

            // Store process reference to manage lifecycle
            global.mcpProcesses = global.mcpProcesses || {};
            global.mcpProcesses[name] = process;
        });

    } catch (error) {
        console.error('Failed to start MCP servers:', error);
    }
}

// Function to stop all MCP servers
function stopMCPServers() {
    if (!global.mcpProcesses) return;

    Object.entries(global.mcpProcesses).forEach(([name, process]) => {
        console.log(`Stopping MCP server: ${name}`);
        process.kill();
    });

    global.mcpProcesses = {};
}

module.exports = {
    configPath,
    startMCPServers,
    stopMCPServers
};