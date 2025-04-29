#!/bin/bash

set -e
    
NVM_DIR="$HOME/.nvm"
REPO_URL="https://github.com/Varadarajan-M/mac-dev-starter-kit.git"
CLONE_DIR="$HOME/mac-dev-starter-kit"

# Step 1: Install NVM if missing
echo "🔍 Checking for NVM..."

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "📥 Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Step 2: Load NVM
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "✅ NVM loaded"

# Step 3: Install latest LTS Node.js version if not already installed
echo "📦 Installing latest LTS Node.js..."
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

# Step 4: Clone repo if not already in project directory
if [ ! -f "package.json" ]; then
  echo "📁 Cloning project repo..."
  git clone "$REPO_URL" "$CLONE_DIR"
  cd "$CLONE_DIR"
else
  echo "📂 Project already cloned. Continuing..."
fi

# Step 5: Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Step 6: Run the CLI
echo "🚀 Running CLI..."
npx ts-node index.ts
