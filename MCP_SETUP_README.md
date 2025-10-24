# 🛠️ Chrome DevTools MCP Server Setup

This document explains how to set up and use the Chrome DevTools MCP server in Cursor IDE.

## 📦 Installation

The Chrome DevTools MCP server has been installed in this project:

```bash
npm install chrome-devtools-mcp@latest
```

## ⚙️ Configuration

### Option 1: Headless Mode (Recommended for Development)
Use `mcp-config.json` for headless Chrome operation:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "node",
      "args": [
        "node_modules/chrome-devtools-mcp/dist/index.js",
        "--headless=true",
        "--isolated=true",
        "--channel=stable"
      ],
      "env": {
        "DEBUG": "chrome-devtools-mcp:*"
      }
    }
  }
}
```

### Option 2: Connect to Running Chrome
Use `mcp-config-chrome-debug.json` to connect to an existing Chrome instance:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "node",
      "args": [
        "node_modules/chrome-devtools-mcp/dist/index.js",
        "--browser-url=http://127.0.0.1:9222"
      ],
      "env": {
        "DEBUG": "chrome-devtools-mcp:*"
      }
    }
  }
}
```

## 🚀 Usage in Cursor

### 1. Start Chrome with Remote Debugging (for Option 2)
```bash
# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-profile-stable"
```

### 2. Configure Cursor MCP
In Cursor settings, configure the MCP server using one of the configuration files above.

### 3. Test Connection
Once configured, you can test the MCP server with:

```
Check the performance of https://developers.chrome.com
```

## 🛠️ Available Tools

The Chrome DevTools MCP server provides these tools:

### Browser (7 tools)
- `browser_get_version`
- `browser_get_user_agent`
- `browser_navigate`
- `browser_refresh`
- `browser_take_screenshot`
- `browser_take_snapshot`
- `browser_wait_for_load`

### Performance (3 tools)
- `performance_get_metrics`
- `performance_start_trace`
- `performance_stop_trace`

### Network (2 tools)
- `get_network_request`
- `list_network_requests`

### Debugging (5 tools)
- `evaluate_script`
- `get_console_message`
- `list_console_messages`
- `take_screenshot`
- `take_snapshot`

## 🔧 Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `--headless` | Run without UI | `false` |
| `--isolated` | Use temporary user data dir | `false` |
| `--channel` | Chrome channel (stable/canary/beta/dev) | `stable` |
| `--executablePath` | Custom Chrome executable path | - |
| `--viewport` | Initial viewport size | - |
| `--logFile` | Debug log file path | - |

## 🔍 Troubleshooting

### Connection Issues
1. Ensure Chrome is running with remote debugging enabled
2. Check that the port (9222) is not already in use
3. Verify firewall settings allow the connection

### Performance Issues
1. Use `--headless=true` for better performance
2. Enable `--isolated=true` for clean state
3. Check available memory and Chrome processes

### Debug Logging
```bash
DEBUG=chrome-devtools-mcp:* node node_modules/chrome-devtools-mcp/dist/index.js --help
```

## 📊 Integration with AI Guardians

The Chrome DevTools MCP server enhances the AI Guardians extension by providing:

- **Browser Automation**: Automated testing and interaction
- **Performance Monitoring**: Real-time performance metrics
- **Network Inspection**: API call analysis and debugging
- **Debugging Capabilities**: Enhanced error diagnosis
- **Screenshot Capture**: Visual regression testing

This integration allows coding agents to interact with web applications and debug issues programmatically.
