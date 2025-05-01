
import Logger from "./utils/logger";
import { isMacOs } from "./utils";

import Homebrew from "./scripts/homebrew";
import NodeRuntime from "./scripts/node";
import Zshrc from "./scripts/zshrc";
import Git from "./scripts/git";
import Editor from "./scripts/editor";
import Browser from "./scripts/browser";
import Terminal from "./scripts/terminal";

import checkbox from "@inquirer/checkbox";

export default class Setup {


  private static async promptStepsToRun(): Promise<string[]> {
    const setupSteps = await checkbox({
      message: "🔧 Select the setup steps you want to run:",
      choices: [
        {
          name: "🍺 Check Homebrew",
          value: "homebrew",
          description: "\n🔍 Verify if Homebrew is installed on your system.",
        },
        {
          name: "🟢 Check Node.js",
          value: "node",
          description: "\n🔍 Verify if Node.js and npm are installed.",
        },
        {
          name: "🖥️  Install Terminals",
          value: "terminals",
          description: "\n💻 Install terminal apps like Warp, Alacritty, iTerm2, etc.",
        },
        {
          name: "🌐 Install Browsers",
          value: "browsers",
          description: "\n🌍 Install Chrome, Firefox, Brave, and more.",
        },
        {
          name: "🔐 Setup Git and Configure SSH Key",
          value: "git",
          description: "\n🛠️ Install Git, configure Git user, and generate an SSH key.",
        },
        {
          name: "📝 Install Code Editors",
          value: "editors",
          description: "\n🧠 Choose from editors like VS Code, Cursor, IntelliJ, and more.",
        },
        {
          name: "⚡ Terminal Productivity Shortcuts",
          value: "zshrc",
          description: "\n🚀 Add aliases, plugins, and shortcuts via an optimized .zshrc.",
        },
      ],
    });
    
    
    return setupSteps;
  }

  public static async process(): Promise<void> {
    Logger.log("🚀 Starting Mac setup…");

    Logger.info("🔍 Checking OS…");
    if (!isMacOs) {
      Logger.error("❌ This script only runs on macOS.");
      return;
    }
    Logger.info("✅ macOS detected.\n");

    const setupSteps = await this.promptStepsToRun();

    if (setupSteps.includes("homebrew")) {
      // 1. Homebrew
      await Homebrew.process();
    }

    if (setupSteps.includes("browsers")) {
      // 2. Browser
      await Browser.process();
    }

    if (setupSteps.includes("terminals")) {
      // 3. Terminal
      await Terminal.process();
    }

    if (setupSteps.includes("editors")) {
      // 4. Code editor
      await Editor.process();
    }

    if (setupSteps.includes("node")) {
      // 5. nvm & Node.js
      await NodeRuntime.process();
    }

    if (setupSteps.includes("git")) {
      // 6. Git
      await Git.process();
    }

    if (setupSteps.includes("zshrc")) {
      // 7. .zshrc (backup & config)
      await Zshrc.process();
    }

    Logger.log("\n🎉 Setup complete!");
  }
}

Setup.process().catch((err) => {
  Logger.error("Unhandled error during setup:", err);
  process.exit(0);
});
