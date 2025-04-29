
import { execAsync } from "../utils";
import Logger from "../utils/logger";
import select from "@inquirer/select";

export default class Editor {
  private static readonly EDITORS = [
    {
      value: "code",
      name: "Visual Studio Code",
      checkCmd: "code -v",
      installCmd: "brew install --cask visual-studio-code",
    },
    {
      value: "cursor",
      name: "Cursor",
      checkCmd: "cursor -v",
      installCmd: "brew install --cask cursor",
    },
  ];

  /** Returns stdout if command succeeds, otherwise null */
  private static async tryCommand(cmd: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(cmd);
      return stdout;
    } catch {
      return null;
    }
  }

  /** Prompt user to select which editor to install */
  private static async promptForEditor(): Promise<string> {
    return select({
      message: "Select a code editor to install:",
      choices: this.EDITORS.map((e) => ({
        name: e.name,
        value: e.value,
        short: e.name,
      })),
    });
  }

  /** Install the chosen editor */
  private static async installEditor(installCmd: string, name: string): Promise<void> {
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
    Logger.log("🔍 Checking for existing code editors...");

    // Check if any editor is already installed
    for (const editor of this.EDITORS) {
      const version = await this.tryCommand(editor.checkCmd);
      if (version) {
        Logger.info(`✅ ${editor.name} is already installed (v${version.trim()}). Skipping installation.`);
        return;
      }
    }

    Logger.warn(
      `No editors found. Available options: ${this.EDITORS.map((e) => e.name).join(", ")}.`
    );

    // Prompt user to choose one
    const choice = await this.promptForEditor();
    const selected = this.EDITORS.find((e) => e.value === choice);
    if (selected) {
      await this.installEditor(selected.installCmd, selected.name);
    }

    Logger.info("🎉 Editor setup complete.");
  }
}
