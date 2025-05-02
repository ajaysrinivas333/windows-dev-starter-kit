import { BackgroundTask } from "../types";
import { execAsync } from "../utils";
import Logger from "../utils/logger";
import checkbox from "@inquirer/checkbox";

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
    {
      value: "intellij-ce",
      name: "IntelliJ IDEA Community Edition",
      checkCmd: `defaults read "/Applications/IntelliJ IDEA CE.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask intellij-idea-ce",
    },
    {
      value: "android-studio",
      name: "Android Studio",
      checkCmd: `defaults read "/Applications/Android Studio.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask android-studio",
    },
    {
      value: "xcode",
      name: "Xcode",
      checkCmd: `xcodebuild -version`,
      installCmd: "brew install --cask xcode",
    },
    {
      value: "intellij-ultimate",
      name: "IntelliJ IDEA Ultimate Edition",
      checkCmd: `defaults read "/Applications/IntelliJ IDEA Ultimate.app/Contents/Info.plist" CFBundleShortVersionString`,
      installCmd: "brew install --cask intellij-idea-ultimate",
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
  private static async promptForEditor(
    availableChoices: typeof this.EDITORS
  ): Promise<string[]> {
    return await checkbox({
      message: "Do you want to install any of the following code editors?",
      choices: availableChoices.map((e) => ({
        name: e.name,
        value: e.value,
        short: e.name,
      })),
    });
  }

  /** Install the chosen editor */
  private static async installEditor(
    installCmd: string,
    name: string
  ): Promise<void> {
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
  public static async process(
    backgroundTasks: BackgroundTask[]
  ): Promise<void> {
    Logger.log("🔍 Checking for existing code editors...");

    const notInstalled: typeof this.EDITORS = [];

    for (const editor of this.EDITORS) {
      const version = await this.tryCommand(editor.checkCmd);
      if (version) {
        Logger.info(
          `✅ ${
            editor.name
          } is already installed (v${version.trim()}). Skipping.`
        );
      } else {
        notInstalled.push(editor);
      }
    }

    if (notInstalled.length === 0) {
      Logger.info("🎉 All code editors are already installed.");
      return;
    }

    const selectedChoices = await this.promptForEditor(notInstalled);

    for (const choice of selectedChoices) {
      const editor = notInstalled.find((e) => e.value === choice);
      if (editor) {
        backgroundTasks.push({
          name: editor.name,
          description: `${editor.name} Installation`,
          getPromise: () => this.installEditor(editor.installCmd, editor.name),
        });
      } else {
        Logger.warn(`⚠️ Skipping unknown editor choice: ${choice}`);
      }
    }
  }
}
