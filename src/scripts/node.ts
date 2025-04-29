
import { execAsync } from "../utils";
import Logger from "../utils/logger";

export default class NodeRuntime {
  private static readonly CHECK_NVM_CMD    = "nvm -v";
  private static readonly CHECK_NODE_CMD   = "node -v";
  private static readonly INSTALL_NVM_CMD  =
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`;
  private static readonly DEFAULT_NODE_VER = "22";

  /** Source nvm and run any command */
  private static async runWithNvm(cmd: string) {
    const full = `. "$HOME/.nvm/nvm.sh" && ${cmd}`;
    return execAsync(full);
  }

  /** Returns installed version of a tool via nvm, or null */
  private static async fetchVersion(cmd: string): Promise<string | null> {
    try {
      const { stdout } = await this.runWithNvm(cmd);
      return stdout.trim();
    } catch {
      return null;
    }
  }

  /** Installs nvm if missing */
  private static async installNvm(): Promise<void> {
    Logger.log("🔧 Installing nvm...");
    try {
      const { stdout } = await execAsync(this.INSTALL_NVM_CMD);
      Logger.info("✅ nvm installed.");
      Logger.msg(stdout.trim());
    } catch (err) {
      Logger.error("❌ nvm install failed:", err);
    }
  }

  /** Installs Node.js via nvm */
  private static async installNode(version: string): Promise<void> {
    Logger.log(`🔧 Installing Node.js v${version}...`);
    try {
      const { stdout } = await this.runWithNvm(`nvm install ${version}`);
      Logger.info(`✅ Node.js v${version} installed.`);
      Logger.msg(stdout.trim());
    } catch (err) {
      Logger.error(`❌ Node.js install failed:`, err);
    }
  }

  /** Verifies `node -v`, `nvm current`, and `npm -v` */
  private static async verifyInstallation(): Promise<void> {
    try {
      const nodeV = await this.runWithNvm(this.CHECK_NODE_CMD);
      const nvmCur = await this.runWithNvm("nvm current");
      const npmV = await this.runWithNvm("npm -v");

      Logger.info(`Node version: ${nodeV.stdout.trim()}`);
      Logger.info(`nvm current: ${nvmCur.stdout.trim()}`);
      Logger.info(`npm version: ${npmV.stdout.trim()}`);
    } catch (err) {
      Logger.error("❌ Verification failed:", err);
    }
  }

  /** Public entrypoint */
  public static async process(): Promise<void> {
    Logger.log("🚀 Starting NodeJS setup...");

    // 1. Ensure nvm
    const nvmVer = await this.fetchVersion(this.CHECK_NVM_CMD);
    if (nvmVer) {
      Logger.info(`nvm is already installed: ${nvmVer}`);
    } else {
      Logger.warn("nvm not found.");
      await this.installNvm();
    }

    // 2. Ensure Node.js
    const nodeVer = await this.fetchVersion(this.CHECK_NODE_CMD);
    if (nodeVer) {
      Logger.info(`Node.js is already installed: ${nodeVer}`);
    } else {
      Logger.warn("Node.js not found.");
      await this.installNode(this.DEFAULT_NODE_VER);
    }

    // 3. Final verification
    await this.verifyInstallation();
  }
}
