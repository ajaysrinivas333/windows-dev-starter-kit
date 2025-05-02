import { execAsync } from "../utils";
import checkbox from "@inquirer/checkbox";
import Logger from "../utils/logger";
import { BackgroundTask } from "../types";

export default class Browser {
  private static readonly BROWSERS = [
    {
      name: "Google Chrome",
      value: "chrome",
      checkCmd: `defaults read "/Applications/Google Chrome.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask google-chrome",
    },
    {
      name: "Firefox",
      value: "firefox",
      checkCmd: `defaults read "/Applications/Firefox.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask firefox",
    },
    {
      name: "Brave",
      value: "brave",
      checkCmd: `defaults read "/Applications/Brave Browser.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask brave-browser",
    },
    {
      name: "Microsoft Edge",
      value: "edge",
      checkCmd: `defaults read "/Applications/Microsoft Edge.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask microsoft-edge",
    },
  ];

  /** Run a check command and return stdout or null */
  private static async tryCommand(cmd: string, log: boolean = true): Promise<string | null> {
    try {
      const { stdout } = await execAsync(cmd);
      if (log) {
        Logger.msg(stdout.trim());
      }
      return stdout.trim();
    } catch {
      return null;
    }
  }

  /** Prompt user to select browsers to install */
  private static async promptForBrowsers(
    availableChoices: typeof this.BROWSERS
  ): Promise<string[]> {
    const choices = availableChoices.map((b) => ({
      name: b.name,
      value: b.value,
    }));

    const selectedChoices = await checkbox({
      message: "Select the browsers you want to install",
      choices,
    });

    return selectedChoices as string[];
  }

  /** Install a given browser */
  private static async installBrowser(installCmd: string, name: string): Promise<void> {
    Logger.info(`🔧 Installing ${name}...`);
    try {
      const msg = await this.tryCommand(installCmd);
      Logger.info(`✅ ${name} installed successfully.`);
    } catch (err) {
      Logger.error(`❌ Failed to install ${name}:`, err);
    }
  }

  /** Main entry point */
  public static async process(backgroundTasks: BackgroundTask[]): Promise<void> {
    Logger.log("🔍 Checking installed browsers...");

    const notInstalled: typeof this.BROWSERS = [];

    for (const browser of this.BROWSERS) {
      const version = await this.tryCommand(browser.checkCmd);
      if (version) {
        Logger.info(`✅ ${browser.name} is already installed (v${version}). Skipping.`);
      } else {
        notInstalled.push(browser);
      }
    }

    if (notInstalled.length === 0) {
      Logger.info("🎉 All browsers are already installed.");
      return;
    }

    const selectedChoices = await this.promptForBrowsers(notInstalled);

    for (const choice of selectedChoices) {
      const browser = notInstalled.find((b) => b.value === choice);
      if (browser) {
        backgroundTasks.push({
          name: browser.name,
          description: `${browser.name} Installation`,
          getPromise: () => this.installBrowser(browser.installCmd, browser.name),
        });
      } else {
        Logger.warn(`⚠️ Skipping unknown browser choice: ${choice}`);
      }
    }

  }
}
