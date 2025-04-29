
import { execAsync } from "../utils";
import Logger from "../utils/logger";

export default class Git {
  private static readonly GET_VERSION_CMD = "git --version";
  private static readonly INSTALL_CMD = "brew install git";

  /** Checks if Git is already installed and returns its version, or null */
  private static async fetchVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync(this.GET_VERSION_CMD);
      return stdout.trim();
    } catch (err) {
      Logger.error("Failed to check Git version:", err);
      return null;
    }
  }

  /** Installs Git via Homebrew */
  private static async installGit(): Promise<void> {
    Logger.log("➡️  Installing Git...");
    try {
      const { stdout } = await execAsync(this.INSTALL_CMD);
      Logger.info("✅ Git installed successfully.");
      Logger.msg(stdout.trim());
    } catch (err) {
      Logger.error("❌ Error installing Git:", err);
    }
  }

  /** Orchestrates the Git setup */
  public static async process(): Promise<void> {
    Logger.log("🔧 Starting Git setup...");

    const version = await this.fetchVersion();
    if (version) {
      Logger.info(`Git is already installed: v${version}`);
      return;
    }

    Logger.warn("Git is not installed.");
    await this.installGit();
  }
}
