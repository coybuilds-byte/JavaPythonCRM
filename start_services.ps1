# 1. Start Python AI Service
Write-Host "Starting Python AI Service..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --reload --port 8000" -WorkingDirectory "$PSScriptRoot\crm-ai-service" -WindowStyle Minimized

# 2. Start Java Backend
Write-Host "Starting Java Backend..." -ForegroundColor Yellow
# Using 'mvn' directly as it is in PATH
Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dspring-boot.run.jvmArguments='-Dmail.smtp.ssl.trust=*'" -WorkingDirectory "$PSScriptRoot\crm-core" -PassThru -NoNewWindow

# 3. Start Frontend
Write-Host "Starting React Frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\crm-web"
npm run dev
