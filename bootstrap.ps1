$LogFile = "$env:USERPROFILE\setup-log.txt"
Set-Content -Path $LogFile -Value "Script started at: $(Get-Date)" -Force

try {
    Write-Host "🛠️ Mac Dev Starter Kit Setup" -ForegroundColor Green | Out-File -Append -FilePath $LogFile

    # Step 1: Install NVM if missing
    Write-Host "🔍 Checking for NVM..." -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    if (-not (Test-Path $env:USERPROFILE\.nvm)) {
        Write-Host "📥 Installing NVM..." -ForegroundColor Yellow | Out-File -Append -FilePath $LogFile
        Invoke-WebRequest -Uri "https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh" -OutFile "$env:USERPROFILE\nvm-install.sh"
        bash "$env:USERPROFILE\nvm-install.sh"
    } else {
        Write-Host "✅ NVM is already installed" -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    }

    # Step 2: Check for Node.js version
    Write-Host "🔍 Checking for Node.js..." -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
        Write-Host "📥 Installing Node.js via NVM..." -ForegroundColor Yellow | Out-File -Append -FilePath $LogFile
        nvm install --lts
        nvm use --lts
    } else {
        Write-Host "✅ Node.js is already installed" -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    }

    # Step 3: Remove existing clone and clone fresh
    if (Test-Path "$env:USERPROFILE\mac-dev-starter-kit") {
        Write-Host "🗑️ Removing existing repository..." -ForegroundColor Yellow | Out-File -Append -FilePath $LogFile
        Remove-Item -Path "$env:USERPROFILE\mac-dev-starter-kit" -Recurse -Force
    }

    Write-Host "📁 Cloning project repo..." -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    git clone "https://github.com/Varadarajan-M/mac-dev-starter-kit.git" "$env:USERPROFILE\mac-dev-starter-kit"

    # Step 4: Install npm dependencies
    Write-Host "📦 Installing npm dependencies..." -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    Set-Location -Path "$env:USERPROFILE\mac-dev-starter-kit"
    npm install

    # Step 5: Run the CLI
    Write-Host "🚀 Running Mac Dev Starter Kit CLI..." -ForegroundColor Green | Out-File -Append -FilePath $LogFile
    npx ts-node src/index.ts

    Write-Host "🛠️ Setup Complete!" -ForegroundColor Green | Out-File -Append -FilePath $LogFile

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red | Out-File -Append -FilePath $LogFile
}
