import { execAsync } from "../utils";
import select from "@inquirer/select";
import Logger from "../utils/logger";

export default class Browser {
    private static readonly BROWSER_CMD = "open -a 'Google Chrome'";


    private static readonly BROWSERS = [
        {
            value: "chrome",
            name: "Google Chrome",
            cmd: `defaults read "/Applications/Google Chrome.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: "brew install --cask google-chrome",
        },
        {
            value: "firefox",
            name: "Firefox",
            cmd: `defaults read "/Applications/Firefox.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: "brew install --cask firefox",
        },
        {
            value: "brave",
            name: "Brave",
            cmd: `defaults read "/Applications/Brave Browser.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: "brew install --cask brave-browser",
        },
    ];


/** Returns stdout if command succeeds, otherwise null */
private static async tryCommand(cmd: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(cmd);
      return stdout;
    } catch (err) {
      Logger.error(`❌ Failed to run ${cmd}:`);
      return null;
    }
  }

  /** Prompt user to select which browser to install */
  private static async promptForBrowser(): Promise<string> {
    return select({
      message: "Select a browser to install:",
      choices: this.BROWSERS.map((e) => ({
        name: e.name,
        value: e.value,
        short: e.name,
      })),
    });
  }


  /** Install the chosen browser */
  private static async installBrowser(installCmd: string, name: string): Promise<void> {
    Logger.log(`🔧 Installing ${name}...`);
    try {
      const { stdout } = await execAsync(installCmd);
      Logger.msg(stdout.trim());
      Logger.info(`✅ ${name} installed successfully.`);
    } catch (err) {
      Logger.error(`❌ Failed to install ${name}:`, err);
    }
  }

  /** Public entry point */
  public static async process(): Promise<void> {
    Logger.log("🔍 Checking for existing browsers...");

    // Check if any browser is already installed
    for (const browser of this.BROWSERS) {
      const version = await this.tryCommand(browser.cmd);
      if (version) {
        Logger.info(`✅ ${browser.name} is already installed (v${version.trim()}). Skipping installation.`);
        return;
      }
    }

    Logger.warn(
      `No browsers found. Available options: ${this.BROWSERS.map((e) => e.name).join(", ")}.`
    );

    // Prompt user to choose one
    const choice = await this.promptForBrowser();
    const selected = this.BROWSERS.find((e) => e.value === choice);
    if (selected) {
      await this.installBrowser(selected.installCmd, selected.name);
    }

    Logger.info("🎉 Editor setup complete.");
  }
}