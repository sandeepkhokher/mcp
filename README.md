# MCP (Model Context Protocol) Tools

This repository contains a complete MCP implementation with both client and server components, along with Claude Desktop for Ubuntu integration.

## 🚀 Overview

This project provides:
- **MCP Client**: Python-based client to connect and interact with MCP servers
- **Weather MCP Server**: Example implementation demonstrating MCP server capabilities
- **Claude Desktop for Ubuntu**: Pre-built Debian package with build scripts
- **ElectronWrapper**: Desktop app wrapper for Claude integration

## 📁 Repository Structure

```
claudeDesktop/
├── claude-desktop-debian/           # Claude Desktop Ubuntu Build
│   ├── scripts/                     # Build and setup scripts
│   ├── .codespellrc                 # Code spell checking config
│   ├── build.sh                     # Main build script
│   ├── claude-desktop_0.9.3_amd64.deb  # Pre-built Debian package
│   ├── LICENSE-APACHE               # Apache license
│   ├── LICENSE-MIT                  # MIT license
│   └── README.md                    # Build instructions
├── electronWrapper/                 # Electron desktop wrapper
├── mcp-client/                      # MCP Client Implementation
│   ├── .venv/                       # Python virtual environment
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore rules
│   ├── .python-version              # Python version specification
│   ├── client.py                    # Main MCP client code
│   ├── main.py                      # Entry point
│   ├── pyproject.toml               # Python project configuration
│   ├── README.md                    # Client documentation
│   └── uv.lock                      # UV dependency lock file
└── weather/                         # Weather MCP Server Example
    ├── .venv/                       # Python virtual environment
    ├── .python-version              # Python version specification
    ├── main.py                      # Weather server entry point
    ├── pyproject.toml               # Project configuration
    ├── README.md                    # Weather server documentation
    ├── uv.lock                      # Dependencies lock file
    ├── weather.py                   # Weather MCP server implementation
    └── .gitignore                   # Git ignore rules
```

## 🛠️ Getting Started

### Prerequisites

- Python 3.8+
- UV package manager (`pip install uv`)
- Anthropic API key
- Ubuntu/Debian (for Claude Desktop installation)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sandeepkhokher/mcp.git
   cd claudeDesktop
   ```

2. **Set up your Anthropic API key**
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```
   
   > Get your API key from [Anthropic Console](https://console.anthropic.com/)

## 🏗️ Installation Options

### Option 1: Use Pre-built Claude Desktop (Recommended)

```bash
cd claude-desktop-debian
sudo dpkg -i claude-desktop_0.9.3_amd64.deb
sudo apt-get install -f  # Fix any dependency issues
```

### Option 2: Build Claude Desktop from Source

```bash
cd claude-desktop-debian
chmod +x build.sh
./build.sh
```

## 🌦️ MCP Client-Server Demo

### Run Weather MCP Server Standalone

```bash
cd weather
uv run main.py
```

### Test MCP Client with Weather Server

```bash
cd mcp-client
uv run client.py ../weather/weather.py
```

This demonstrates:
- MCP client establishing connection with weather server
- Server exposing weather-related tools and resources
- Real-time communication through the MCP protocol
- Tool execution and response handling

## 🔧 MCP Client Usage

The MCP client (`mcp-client/client.py`) can connect to various MCP servers:

```bash
# Connect to local MCP server
uv run client.py path/to/server.py

# Run client interactively
uv run main.py
```

### Environment Configuration

Create `.env` file in `mcp-client/` directory:
```env
ANTHROPIC_API_KEY=your-api-key-here
MCP_SERVER_PATH=../weather/weather.py
```

## 🌍 Weather MCP Server

The weather server (`weather/weather.py`) provides:
- Weather data retrieval tools
- Location-based weather queries
- Forecast information
- Example of MCP server implementation patterns

### Available Weather Tools
- Current weather conditions
- Weather forecasts
- Location-based weather data
- Historical weather information

## 🖥️ Claude Desktop Integration

1. **Install** Claude Desktop using the provided Debian package
2. **Configure MCP servers** in Claude Desktop settings:
   ```json
   {
     "mcpServers": {
       "weather": {
         "command": "uv",
         "args": ["run", "main.py"],
         "cwd": "/path/to/weather"
       }
     }
   }
   ```
3. **Restart** Claude Desktop to load MCP servers

## 📋 Development

### Project Structure
- **UV Package Manager**: All Python projects use `uv` for dependency management
- **Virtual Environments**: Each component has isolated dependencies
- **Lock Files**: `uv.lock` ensures reproducible builds
- **Python Version**: Specified in `.python-version` files

### Adding New MCP Servers

1. Create new directory following the `weather/` structure
2. Implement MCP server using the weather server as template
3. Add `pyproject.toml` and configure dependencies
4. Test with MCP client

### Development Commands

```bash
# Install dependencies
uv install

# Run with development mode
uv run --dev main.py

# Update dependencies
uv lock --upgrade
```

## 🐛 Troubleshooting

### Common Issues

**MCP Client Connection Failed:**
```bash
# Check server is running
cd weather && uv run main.py

# Verify client configuration
cd mcp-client && uv run client.py --help
```

**Claude Desktop Installation Issues:**
```bash
# Fix dependency issues
sudo apt-get install -f

# Check installation
dpkg -l | grep claude
```

**API Key Issues:**
- Verify API key is set: `echo $ANTHROPIC_API_KEY`
- Check API key permissions in Anthropic Console
- Ensure `.env` file is properly configured

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Follow existing code structure and naming conventions
4. Test with both weather server and MCP client
5. Update documentation as needed
6. Submit pull request

## 📄 License

This project includes multiple license options:
- Apache License 2.0 (`LICENSE-APACHE`)
- MIT License (`LICENSE-MIT`)

See individual component directories for specific licensing.

## 🔗 Related Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [UV Package Manager](https://github.com/astral-sh/uv)

## 📞 Support

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check individual README files in each component

---

**Ready to explore MCP capabilities!** 🚀 Start with the weather demo and build your own MCP servers.