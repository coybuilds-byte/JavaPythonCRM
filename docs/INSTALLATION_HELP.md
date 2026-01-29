# Environment Setup Guide

## 1. Download & Install Missing Tools

### **Python 3.12+**
*   **Download:** [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **Important:** During installation, check the box **"Add Python to PATH"**.

### **Node.js (LTS Version)**
*   **Download:** [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
*   **Install:** Standard installation (Next, Next, Finish).

---

## 2. Configure Java & Maven (Fix "Command not found")

Since you already downloaded Java and Maven, Windows likely just doesn't know where they are.

### **Step A: Locate your folders**
1.  **Java JDK**: Find where you installed/extracted it.
    *   *Example:* `C:\Program Files\Java\jdk-21`
2.  **Maven**: Find where you extracted it.
    *   *Example:* `C:\Program Files\Apache\maven-3.9.6`

### **Step B: Add to PATH Environment Variable**
1.  Press **Windows Key**, type **"Edit the system environment variables"**, and hit Enter.
2.  Click the **Environment Variables...** button.
3.  In the **System variables** section (bottom half), find the variable named **Path** and click **Edit**.
4.  Click **New** and add the path to the `bin` folder for **Java**:
    *   *Example:* `C:\Program Files\Java\jdk-21\bin`
5.  Click **New** again and add the path to the `bin` folder for **Maven**:
    *   *Example:* `C:\Program Files\Apache\maven-3.9.6\bin`
6.  Click **OK** on all windows.

### **Step C: Verify**
**Close your current version of PowerShell/Terminal and open a new one.**
Run these commands to check:
```powershell
java -version
mvn -version
python --version
node -v
```
