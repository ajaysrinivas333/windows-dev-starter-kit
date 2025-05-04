# Enable colored output
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Banner
Write-Log "🛠️  Windows Dev Starter Kit" "Green"
Write-Log "==============================" "Green"
Write-Host ""

# Step 1: Install Chocolatey if not found
Write-Log "🔍 Checking for Chocolatey..." "Yellow"
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Log "`n📥 Installing Chocolatey..." "Yellow"

    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

    Write-Log "✅ Chocolatey installed successfully." "Green"
} else {
    Write-Log "✅ Chocolatey is already installed." "Cyan"
}
Write-Host ""

# Step 2: Install Git if missing
Write-Log "🔍 Checking for Git..." "Yellow"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Log "`n📥 Installing Git..." "Yellow"
    choco install git -y
    Write-Log "✅ Git installed successfully." "Green"
} else {
    Write-Log "✅ Git is already installed." "Cyan"
}
Write-Host ""

# Step 3: Install NVM if Node.js is missing
Write-Log "🔍 Checking for Node.js..." "Yellow"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Log "`n📥 Installing NVM for Windows..." "Yellow"
    choco install nvm -y

    $nvmExe = "$env:ProgramData\chocolatey\lib\nvm\tools\nvm.exe"
    if (Test-Path $nvmExe) {
        & $nvmExe install lts
        & $nvmExe use lts
        Write-Log "✅ Node.js (LTS) installed via NVM." "Green"
    } else {
        Write-Log "❌ NVM installation failed or not found." "Red"
        exit 1
    }
} else {
    Write-Log "✅ Node.js is already installed." "Cyan"
}
Write-Host ""

# Step 4: Clone the GitHub repo
$repoUrl = "https://github.com/Varadarajan-M/mac-dev-starter-kit.git"
$cloneDir = "$env:USERPROFILE\mac-dev-starter-kit"

Write-Log "📁 Checking project directory..." "Yellow"
if (Test-Path $cloneDir) {
    Write-Log "`n🗑️  Removing existing repository..." "Yellow"
    Remove-Item $cloneDir -Recurse -Force
}
Write-Log "`n📥 Cloning project repo..." "Yellow"
git clone $repoUrl $cloneDir
Set-Location $cloneDir
Write-Log "✅ Repository cloned to $cloneDir" "Green"
Write-Host ""

# Step 5: Install npm dependencies
Write-Log "📦 Installing npm dependencies..." "Yellow"
npm install
Write-Log "✅ npm dependencies installed." "Green"
Write-Host ""

# Step 6: Run the CLI (TypeScript file)
Write-Log "🚀 Running Dev Starter Kit CLI..." "Yellow"
npx ts-node src/index.ts
Write-Host ""
