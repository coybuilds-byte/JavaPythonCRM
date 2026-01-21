$env:Path += ";C:\Program Files\maven\bin"

# 1. Start Python AI Service
Write-Host "Starting Python AI Service..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --reload --port 8000" -WorkingDirectory "C:\Users\jesse\.gemini\antigravity\scratch\JavaPythonCRM\crm-ai-service" -WindowStyle Minimized

# 2. Start Java Backend
Write-Host "Starting Java Backend..." -ForegroundColor Yellow
$javaProcess = Start-Process -FilePath "C:\Program Files\maven\bin\mvn.cmd" -ArgumentList "spring-boot:run -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dspring-boot.run.jvmArguments='-Dmail.smtp.ssl.trust=*'" -WorkingDirectory "C:\Users\jesse\.gemini\antigravity\scratch\JavaPythonCRM\crm-core" -PassThru -NoNewWindow

# 3. Start Frontend
Write-Host "Starting React Frontend..." -ForegroundColor Yellow
Set-Location "C:\Users\jesse\.gemini\antigravity\scratch\JavaPythonCRM\crm-web"
npm run dev


