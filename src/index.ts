import Logger from "./utils/logger";
import { isMacOs } from "./utils";

import Homebrew from "./scripts/homebrew";
import NodeRuntime from "./scripts/node";
import Zshrc from "./scripts/zshrc";
import Git from "./scripts/git";
import Editor from "./scripts/editor";
import Browser from "./scripts/browser";
import Terminal from "./scripts/terminal";
import Communication from "./scripts/communication";
import JsPackageManager from "./scripts/js-package-manager";

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
          name: "🔍 Install JavaScript Package Managers",
          value: "js-package-manager",
          description: "\n🔍 Install JavaScript package managers like yarn and pnpm. (Optional) npm is already installed.",
        },
        {
          name: "🖥️  Install Terminals",
          value: "terminals",
          description:
            "\n💻 Install terminal apps like Warp, Alacritty, iTerm2, etc.",
        },
        {
          name: "🌐 Install Browsers",
          value: "browsers",
          description: "\n🌍 Install Chrome, Firefox, Brave, and more.",
        },
        {
          name: "📝 Install Code Editors",
          value: "editors",
          description:
            "\n🧠 Choose from editors like VS Code, Cursor, IntelliJ, and more.",
        },
        {
          name: "💬 Install Communication Apps",
          value: "communication",
          description:
            "\n💬 Install communication apps like Slack, Discord, Microsoft Teams, and more.",
        },
        {
          name: "🔐 Setup Git and Configure SSH Key",
          value: "git",
          description:
            "\n🛠️ Install Git, configure Git user, and generate an SSH key.",
        },
        {
          name: "⚡ Terminal Productivity Shortcuts",
          value: "zshrc",
          description:
            "\n🚀 Add aliases, plugins, and shortcuts via an optimized .zshrc.",
        },
      ],
      pageSize: 20,
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
      await Homebrew.process();
    }

    if (setupSteps.includes("js-package-manager")) {
      await JsPackageManager.process();
    }

    if (setupSteps.includes("browsers")) {
      await Browser.process();
    }

    if (setupSteps.includes("terminals")) {
      await Terminal.process();
    }

    if (setupSteps.includes("editors")) {
      await Editor.process();
    }

    if (setupSteps.includes("node")) {
      await NodeRuntime.process();
    }

    if (setupSteps.includes("git")) {
      await Git.process();
    }

    if (setupSteps.includes("zshrc")) {
      await Zshrc.process();
    }

    if (setupSteps.includes("communication")) {
      await Communication.process();
    }

    Logger.log("\n🎉 Setup complete!");
  }
}

Setup.process().catch((err) => {
  Logger.error("Unhandled error during setup:", err);
  process.exit(0);
});
