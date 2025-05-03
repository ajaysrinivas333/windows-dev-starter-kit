#!/bin/bash

set -e
    
NVM_DIR="$HOME/.nvm"
REPO_URL="https://github.com/Varadarajan-M/mac-dev-starter-kit.git"
CLONE_DIR="$HOME/mac-dev-starter-kit"


echo "🛠️ Mac Dev Starter Kit"
echo "======================="
# Step 1: Install NVM if missing
echo "🔍 Checking for NVM...\n"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "📥 Installing NVM...\n"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Step 2: Load NVM
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "✅ NVM loaded\n"

# Step 3: Install latest LTS Node.js version if not already installed
echo "📦 Installing latest LTS Node.js...\n"
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

# Step 4: Remove existing clone and clone fresh
if [ -d "$CLONE_DIR" ]; then
  echo "🗑️ Removing existing repository...\n"
  rm -rf "$CLONE_DIR"
fi

echo "📁 Cloning project repo...\n"
git clone "$REPO_URL" "$CLONE_DIR"
cd "$CLONE_DIR"

# Step 5: Install dependencies
echo "📦 Installing npm dependencies...\n"
npm install

# Step 6: Run the CLI
echo "🚀 Running Mac Dev Starter Kit CLI...\n"
npx ts-node src/index.ts