# Opening JavaPythonCRM in Antigravity IDE

This guide explains how to set up and use the JavaPythonCRM project with [Google Antigravity](https://antigravity.google/) IDE.

## What is Antigravity?

Antigravity is Google's agent-first AI development platform - a powerful IDE forked from VS Code with enhanced AI capabilities for coding assistance, debugging, and development workflows.

## Prerequisites

1. **Install Antigravity**: Download and install from [antigravity.google](https://antigravity.google/)
2. **Sign in**: Use your personal Google (Gmail) account
3. **Requirements for this project**:
   - Java 17 or higher
   - Apache Maven
   - Node.js and npm
   - Python 3.8+

## Opening This Repository

### Method 1: Clone via Antigravity (Recommended)

1. Open Antigravity IDE
2. Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac)
3. Type "Git: Clone" and select it
4. Enter the repository URL: `https://github.com/coybuilds-byte/JavaPythonCRM.git`
5. Choose a local folder to clone to
6. Open the cloned folder in Antigravity

### Method 2: Clone via Terminal

1. Open your terminal or command prompt
2. Navigate to your desired workspace directory
3. Run: `git clone https://github.com/coybuilds-byte/JavaPythonCRM.git`
4. Open Antigravity and select `File > Open Folder`
5. Navigate to the cloned `JavaPythonCRM` directory and open it

## Recommended Extensions

When you first open this repository in Antigravity, you'll be prompted to install recommended extensions. These extensions are pre-configured in `.antigravity/extensions.json` and include:

- **Java Development**:
  - Java Extension Pack (vscjava.vscode-java-pack)
  - Spring Boot Dashboard (vscjava.vscode-spring-boot-dashboard)
  - Spring Boot Tools (pivotal.vscode-boot-dev-pack)

- **Python Development**:
  - Python (ms-python.python)
  - Python Environment Selector (ms-python.venv-selector)

- **Frontend Development**:
  - ESLint (dbaeumer.vscode-eslint)
  - Prettier - Code formatter (esbenp.prettier-vscode)
  - React/Redux/GraphQL snippets (dsznajder.es7-react-js-snippets)
  - Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

- **General**:
  - YAML (redhat.vscode-yaml)
  - GitHub Copilot (GitHub.copilot)

Click "Install All" when prompted, or install them individually from the Extensions panel.

## Workspace Configuration

This repository includes pre-configured settings in `.antigravity/settings.json` that optimize the development experience:

- **Code Formatting**: Auto-formatting on save with Prettier for JS/TS files
- **Auto-save**: Files are automatically saved after 1 second of inactivity
- **Java Settings**: Automatic build configuration updates
- **Python Settings**: Pre-configured virtual environment path (Windows default; Linux/Mac users may need to change to `.venv/bin/python`)
- **Terminal**: Default PowerShell on Windows, zsh on macOS, bash on Linux

## Running the Services

Once you have the workspace open in Antigravity:

### 1. Python AI Service (Backend)

Open a new terminal in Antigravity (``Ctrl+` `` or Terminal > New Terminal):

```bash
cd crm-ai-service
# On Windows
.venv\Scripts\activate
# On Linux/Mac
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

The service will run on `http://localhost:8000`

### 2. React Frontend

Open another terminal:

```bash
cd crm-web
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Java Backend (Spring Boot)

Open another terminal:

```bash
cd crm-core
mvn spring-boot:run
```

The backend will run on `http://localhost:8080`

## Using Antigravity Features

### AI Agent Assistance

- Press `Cmd + L` (Mac) or `Ctrl + L` (Windows/Linux) to open the Agent Manager panel
- Ask the AI agent to help with:
  - Understanding the codebase
  - Debugging issues
  - Writing new features
  - Refactoring code

### Integrated Debugging

- Set breakpoints in Java, Python, or JavaScript files by clicking in the gutter
- Use the Run and Debug panel (`Ctrl+Shift+D`) to start debugging sessions
- The workspace is pre-configured with appropriate debugger settings

### Git Integration

- Use the Source Control panel (third icon on the left sidebar) for Git operations
- Stage, commit, and push changes directly from Antigravity
- View diffs and resolve merge conflicts with built-in tools

## Troubleshooting

### Extensions Not Loading

If recommended extensions don't install automatically:
1. Open Extensions panel (`Ctrl+Shift+X`)
2. Search for each extension by name
3. Install manually

### Terminal Not Finding Commands

If `mvn`, `node`, or `python` commands are not found:
1. Ensure they are installed on your system
2. Restart Antigravity after installation
3. Check that they are in your system PATH

### Python Virtual Environment Issues

If the Python virtual environment is not detected:
1. Create it manually: `python -m venv .venv` in the `crm-ai-service` directory
2. Restart Antigravity
3. Select the interpreter: `Ctrl+Shift+P` > "Python: Select Interpreter"

## Additional Resources

- [Antigravity Documentation](https://antigravity.google/docs)
- [Getting Started with Google Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Project README](./README.md)
- [Setup Guide](./SETUP_GUIDE.md)

## Feedback and Issues

If you encounter any issues with the Antigravity configuration:
1. Check the Antigravity documentation
2. Review the workspace settings in `.antigravity/settings.json`
3. Open an issue in the repository with details about the problem
