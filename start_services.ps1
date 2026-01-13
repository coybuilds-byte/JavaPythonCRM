$env:Path += ";C:\Program Files\maven\bin"

# 1. Start Python AI Service
Write-Host "Starting Python AI Service..." -ForegroundColor Yellow
Start-Process -FilePath "uvicorn" -ArgumentList "main:app --reload --port 8000" -WorkingDirectory "C:\Users\jesse\.gemini\antigravity\scratch\JavaPythonCRM\crm-ai-service" -WindowStyle Minimized

# 2. Start Java Backend
Write-Host "Starting Java Backend..." -ForegroundColor Yellow
$javaProcess = Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -WorkingDirectory "C:\Users\jesse\.gemini\antigravity\scratch\JavaPythonCRM\crm-core" -PassThru -NoNewWindow

# 3. Start Frontend
Write-Host "Starting React Frontend..." -ForegroundColor Yellow
Set-Location "C:\Users\jesse\.gemini\antigravity\scratch\JavaPythonCRM\crm-web"
npm run dev


