import { execAsync } from "../utils";
import Logger from "../utils/logger";
import select from "@inquirer/select";
import input from "@inquirer/input";
import { BackgroundTask } from "../types";

export default class Git {
  private static readonly GET_VERSION_CMD = "git --version";
  private static readonly INSTALL_CMD = "brew install git";

  /** Runs a shell command and logs trimmed output */
  private static async runCommand(cmd: string, log = false): Promise<string> {
    try {
      const { stdout } = await execAsync(cmd);
      const output = stdout.trim();
      if (log && output) Logger.msg(output);
      return output;
    } catch (err) {
      Logger.error(`❌ Command failed: ${cmd}`, err);
      return "";
    }
  }

  /** Checks if Git is already installed and returns its version */
  private static async fetchVersion(): Promise<string | null> {
    const version = await this.runCommand(this.GET_VERSION_CMD);
    return version || null;
  }

  /** Installs Git via Homebrew */
  private static async installGit(): Promise<void> {
    Logger.log("➡️ Installing Git...");
    const output = await this.runCommand(this.INSTALL_CMD, true);
    if (output) Logger.info("✅ Git installed successfully.");
  }

  /** Prompts user for yes/no choice */
  private static async confirm(message: string): Promise<boolean> {
    const choice = await select({
      message,
      choices: [
        { name: "Yes", value: "yes" },
        { name: "No", value: "no" },
      ],
    });
    return choice === "yes";
  }

  /** Configures Git username and email */
  private static async configureGit(): Promise<string> {
    Logger.log("🔧 Configuring Git username and email...");

    const name = await input({
      message: "Enter your Git username:",
      validate: (v) =>
        v?.trim()?.length > 2 || "Name must be at least 3 characters long",
    });

    const email = await input({
      message: "Enter your Git email:",
      validate: (v) =>
        (v?.trim()?.length > 0 && v.includes("@")) || "Invalid email address",
    });

    await this.runCommand(`git config --global user.name "${name}"`, true);
    await this.runCommand(`git config --global user.email "${email}"`, true);

    Logger.log("✅ Git configuration complete");
    return email;
  }

  /** Configures SSH key for GitHub */
  private static async configureSSH(email: string): Promise<void> {
    Logger.log("🔧 Setting up SSH for GitHub...");

    const fileName = `id_ed25519_${email.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_${Date.now()}`;
    const sshPath = `~/.ssh/${fileName}`;

    await this.runCommand(
      `ssh-keygen -t ed25519 -C "${email}" -f ${sshPath} -N ""`,
      true
    );

    const publicKey = await this.runCommand(`cat ${sshPath}.pub`);
    if (publicKey) {
      Logger.info(
        "📝 Copy the following SSH key and paste it into your GitHub account:"
      );
      Logger.msg(publicKey);
    }

    await this.runCommand(`eval "$(ssh-agent -s)"`, true);
    await this.runCommand(`ssh-add ${sshPath}`, true);

    Logger.log("✅ SSH configuration complete");
  }

  /** Main orchestrator */
  public static async process(): Promise<void> {
    Logger.log("🔧 Starting Git setup...");

    const version = await this.fetchVersion();
    if (version) {
      Logger.info(`✅ Git is already installed: ${version}`);
    } else {
      Logger.warn("🚫 Git is not installed.");
      await this.installGit();
    }

    const shouldConfigureGit = await this.confirm(
      "Do you want to configure Git?"
    );
    let email: string | null = null;

    if (shouldConfigureGit) {
      email = await this.configureGit();
    } else {
      Logger.log("ℹ️ Skipping Git configuration.");
    }

    if (email) {
      const shouldConfigureSSH = await this.confirm(
        "Do you want to configure Git SSH?"
      );
      if (shouldConfigureSSH) {
        await this.configureSSH(email);
      } else {
        Logger.log("ℹ️ Skipping SSH configuration.");
      }
    }

    Logger.log("🎉 Git setup complete!");
  }
}
