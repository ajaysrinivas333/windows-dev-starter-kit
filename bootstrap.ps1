# bootstrap.ps1

# Configuration
$LogFile    = "$env:USERPROFILE\setup-log.txt"
$RepoUrl    = "https://github.com/ajaysrinivas333/windows-dev-starter-kit.git"
$ClonePath  = "$env:USERPROFILE\windows-dev-starter-kit"

# Logging helper
function Log {
    param([string]$Message, [string]$Color = 'White')
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $entry     = "$timestamp - $Message"
    # Write to console
    Write-Host $entry -ForegroundColor $Color
    # Append to log file
    $entry | Out-File -FilePath $LogFile -Append
}

# Start
Log "==============================="
Log "🛠️  Windows Dev Starter Kit"
Log "==============================="

try {
    # Chocolatey
    Log "🔍 Checking for Chocolatey..." Yellow
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Log "📥 Installing Chocolatey..." Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-Expression ((New-Object Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Log "✅ Chocolatey installed" Green
    } else {
        Log "✅ Chocolatey already installed" Cyan
    }

    # Git
    Log "🔍 Checking for Git..." Yellow
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Log "📥 Installing Git via Chocolatey..." Yellow
        choco install git -y
        Log "✅ Git installed" Green
    } else {
        Log "✅ Git already installed" Cyan
    }

    # NVM & Node.js
    Log "🔍 Checking for Node.js..." Yellow
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Log "📥 Installing NVM for Windows..." Yellow
        choco install nvm -y

        # Setup environment for NVM
        $nvmHome       = "$env:ProgramData\chocolatey\lib\nvm\tools\nvm.exe"
        $env:NVM_HOME  = Split-Path $nvmHome
        $env:Path     += ";$env:NVM_HOME;$env:APPDATA\npm"

        Log "📦 Installing latest LTS Node.js via NVM..." Yellow
        & $nvmHome install lts
        & $nvmHome use lts
        Log "✅ Node.js installed (LTS)" Green
    } else {
        Log "✅ Node.js already installed" Cyan
    }

    # Clone repository
    if (Test-Path $ClonePath) {
        Log "🗑️  Removing existing repository..." Yellow
        Remove-Item -Recurse -Force $ClonePath
        Log "✅ Old repo removed" Green
    }
    Log "📁 Cloning project repo..." Yellow
    git clone $RepoUrl $ClonePath
    Log "✅ Repo cloned to $ClonePath" Green

    # Install dependencies
    Log "📦 Installing npm dependencies..." Yellow
    Push-Location $ClonePath
    npm install
    Log "✅ npm install complete" Green
    Pop-Location

    # Run CLI
    Log "🚀 Running Dev Starter Kit CLI..." Yellow
    Push-Location $ClonePath
    npx ts-node src/index.ts
    Pop-Location
    Log "✅ CLI executed successfully" Green

    Log "🛠️ Setup Complete!" Green
}
catch {
    Log "❌ ERROR: $($_.Exception.Message)" Red
    Write-Error "An error occurred—see log at $LogFile"
    exit 1
}
