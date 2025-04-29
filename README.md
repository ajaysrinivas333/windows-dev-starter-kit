# 🛠️ Mac Dev Starter Kit

A modern CLI tool to automate and bootstrap your macOS development environment in minutes.

> Installs Git, Node (via NVM), code editors, terminal apps, browser tools, and more — all with one command.

---

## 🚀 Features

- ✅ macOS check
- 🔧 Sets up Node.js using NVM
- 🧶 Installs Yarn (optional) - Upcoming
- 🗂️ Installs and configures Git
- 🖥️ Installs your preferred Code Editor (VSCode, Cursor, etc.)
- 🌐 Installs browser tools (Chrome, Firefox, Brave)
- 🖥️ Installs terminal apps (Warp, iTerm2)
- ⚙️ Updates your `.zshrc` config

> ❌ This script does not configure SSH keys.  
> ✅ Requires Homebrew to be installed beforehand.

---

## ⚡ Quickstart

If you already have **Homebrew** installed, bootstrap your dev setup with:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Varadarajan-M/mac-dev-starter-kit/main/bootstrap.sh)"
```

This will:

- Install NVM and the latest **LTS** version of Node.js
- Clone the `init-mac-dev` project
- Install dependencies
- Launch the interactive CLI setup

---

## 🧰 Usage (after cloning)

If you cloned the repo manually:

```bash
npm install
npm start
```

---

## 📁 Folder Structure

```
.
├── bootstrap.sh       # Kickstarts setup for fresh systems
├── index.ts           # CLI entry point
├── scripts/           # Modular scripts (Node, Git, Editors, etc.)
│   ├── git.ts         # Git setup logic
│   ├── node.ts        # Node.js + NVM installation
│   ├── editor.ts      # Installs code editors
│   └── browser.ts     # Installs browsers
├── utils/             # Helpers (logger, OS checks, prompts, etc.)
│   ├── logger.ts
│   └── index.ts
└── README.md          # You're here 🚀
```

