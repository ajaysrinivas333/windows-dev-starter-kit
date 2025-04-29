import { execAsync } from "../utils";
import Logger from "../utils/logger";
import select from "@inquirer/select";
import input from "@inquirer/input";

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

  private static async promptForGitConfig(): Promise<string> {
    return await select({
      message: "Do you want to configure Git?",
      choices: [
        { name: "Yes", value: "yes" },
        { name: "No", value: "no" },
      ],
    });
  }

  private static async configureGit(): Promise<void> {
    Logger.log("🔧 Configuring git username and email...");

    const name = await input({
      message: "Enter your git username:",
      validate(value) {
        return (
          value?.trim()?.length > 2 ||
          "Name should be atleast 2 characters long"
        );
      },
    });
    const email = await input({
      message: "Enter your git email:",
      validate: (v) =>
        (v?.trim()?.length > 0 && v?.includes("@")) || "Invalid email",
    });

    const { stdout } = await execAsync(
      `git config --global user.name "${name}"`
    );
    Logger.msg(stdout.trim());

    const { stdout: emailStdout } = await execAsync(
      `git config --global user.email "${email}"`
    );
    Logger.msg(emailStdout.trim());

    if (stdout && emailStdout) {
      Logger.log("✅ Git username and email configuration complete");
    }
  }

  /** Orchestrates the Git setup */
  /** Orchestrates the Git setup */
  public static async process(): Promise<void> {
    Logger.log("🔧 Starting Git setup...");

    const version = await this.fetchVersion();
    if (version) {
      Logger.info(`Git is already installed: v${version}`);
    } else {
      Logger.warn("Git is not installed.");
      await this.installGit();
    }

    const config = await this.promptForGitConfig();
    if (config === "yes") {
      await this.configureGit();
    } else {
      Logger.log("Skipping Git configuration");
    }

    Logger.log("✅ Git setup complete");
  }
}
