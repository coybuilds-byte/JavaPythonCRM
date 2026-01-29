# Environment Setup Instructions

## 1. Backend (Java/Maven)
The command `mvn` was not found. You need to install **Apache Maven**.

1.  **Download Maven**: Go to [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi).
2.  **Install**: Download the "Binary zip archive", extract it to a folder (e.g., `C:\Program Files\Maven`).
3.  **Add to PATH**:
    *   Search for "Edit the system environment variables" in Windows.
    *   Click "Environment Variables".
    *   Under "System variables", find `Path`, click "Edit", and add the path to the `bin` folder of your Maven extraction (e.g., `C:\Program Files\Maven\apache-maven-3.9.6\bin`).
4.  **Verify**: Open a new PowerShell and type `mvn -version`.

## 2. Frontend (Node.js)
Node.js appears to be installed (`npm -v` returned 11.6.2).
To run the frontend:
1.  Open PowerShell.
2.  Navigate to the web folder:
    ```powershell
    cd crm-web
    ```
3.  Install dependencies (if not done):
    ```powershell
    npm install
    ```
4.  Start server:
    ```powershell
    npm run dev
    ```
