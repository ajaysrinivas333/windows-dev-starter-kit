
import { execAsync } from "../utils";
import Logger from "../utils/logger";

export default class Homebrew {
  private static readonly CHECK_CMD = "brew -v";
  private static readonly INSTALL_CMD =
    `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`;

  /** Returns the installed Homebrew version, or null if not found */
  private static async fetchVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync(this.CHECK_CMD, { encoding: "utf-8" });
      return stdout.trim();
    } catch {
      return null;
    }
  }

  /** Logs and shows the install instruction for Homebrew */
  private static reportMissing(): void {
    Logger.error("Homebrew not found. Please install it with:");
    Logger.msg(this.INSTALL_CMD);
  }

  /** Orchestrates the Homebrew check (no automatic install) */
  public static async process(): Promise<void> {
    Logger.log("🔧 Checking Homebrew…");

    const version = await this.fetchVersion();
    if (version) {
      Logger.info(`Homebrew is already installed: ${version}`);
    } else {
      this.reportMissing();
      process.exit(1);
    }
  }
}
