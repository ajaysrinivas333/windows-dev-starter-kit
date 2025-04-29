
import Logger from "./utils/logger";
import { isMacOs } from "./utils";

import Homebrew from "./scripts/homebrew";
import NodeRuntime from "./scripts/node";
import Zshrc from "./scripts/zshrc";
import Git from "./scripts/git";
import Editor from "./scripts/editor";
import Browser from "./scripts/browser";
import Terminal from "./scripts/terminal";

export default class Setup {
  public static async process(): Promise<void> {
    Logger.log("🚀 Starting Mac setup…");

    Logger.info("🔍 Checking OS…");
    if (!isMacOs) {
      Logger.error("❌ This script only runs on macOS.");
      return;
    }
    Logger.info("✅ macOS detected.\n");

    // 1. Homebrew
    await Homebrew.process();

    // 2. Browser
    await Browser.process();

    // 3. Terminal
    await Terminal.process();

    // 4. Code editor
    await Editor.process();

    // 5. nvm & Node.js
    await NodeRuntime.process();

    // 6. Git
    await Git.process();

    // 7. .zshrc (backup & config)
    await Zshrc.process();

    Logger.log("\n🎉 Setup complete!");
  }
}

Setup.process().catch((err) => {
  Logger.error("Unhandled error during setup:", err);
  process.exit(0);
});
