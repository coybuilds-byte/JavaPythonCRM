Write-Host "Stopping Services..." -ForegroundColor Yellow

$ports = @(8000, 8080, 5173)

foreach ($port in $ports) {
    try {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction Stop | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pid_val in $processes) {
            # Check if process exists before killing
            if (Get-Process -Id $pid_val -ErrorAction SilentlyContinue) {
                Write-Host "Killing process $pid_val on port $port" -ForegroundColor Red
                Stop-Process -Id $pid_val -Force -ErrorAction SilentlyContinue
            }
        }
    }
    catch {
        # Ignore errors if port not valid or no connection
    }
}

# Wait for cleanup
Start-Sleep -Seconds 3

Write-Host "Services Stopped. Restarting..." -ForegroundColor Green
& "$PSScriptRoot\start_services.ps1"
