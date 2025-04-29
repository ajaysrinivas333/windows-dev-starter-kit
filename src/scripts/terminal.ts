import { execAsync } from "../utils";
import Logger from "../utils/logger";
import checkbox from "@inquirer/checkbox";

export default class Terminal {
  private static readonly TERMINALS = [
    {
      name: "Alacritty",
      value: "alacritty",
      installCmd: "brew install --cask alacritty",
      checkCmd: "command -v alacritty",
    },
    {
      name: "iTerm2",
      value: "iterm2",
      installCmd: "brew install --cask iterm2",
      checkCmd: "ls /Applications/iTerm.app",
    },
    {
      name: "Hyper",
      value: "hyper",
      installCmd: "brew install --cask hyper",
      checkCmd: "command -v hyper",
    },
    {
      name: "Warp",
      value: "warp",
      installCmd: "brew install --cask warp",
      checkCmd: "ls /Applications/Warp.app",
    },
    {
      name: "WezTerm",
      value: "wezterm",
      installCmd: "brew install --cask wezterm",
      checkCmd: "command -v wezterm",
    },
    {
      name: "Kitty",
      value: "kitty",
      installCmd: "brew install --cask kitty",
      checkCmd: "command -v kitty",
    },
  ];

  private static async tryCommand(cmd: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(cmd);
      return stdout.trim();
    } catch (error) {
      return null;
    }
  }

  private static async promptForTerminal(
    availableChoices: typeof this.TERMINALS
  ): Promise<string[]> {
    const choices = availableChoices.map((t) => t.value);
    const selectedChoices = await checkbox({
      message: "Select the terminals you want to install",
      choices,
    });
    return selectedChoices as string[];
  }

  private static async installTerminal(
    installCmd: string,
    name: string
  ): Promise<void> {
    Logger.info(`Installing ${name}...`);
    await execAsync(installCmd);
    Logger.info(`${name} installed successfully.`);
  }

  public static async process(): Promise<void> {
    const notInstalled: typeof this.TERMINALS = [];

    for (const terminal of this.TERMINALS) {
      const version = await this.tryCommand(terminal.checkCmd);
      if (version) {
        Logger.info(
          `✅ ${
            terminal.name
          } is already installed (v${version.trim()}). Skipping.`
        );
      } else {
        notInstalled.push(terminal);
      }
    }

    if (notInstalled.length === 0) {
      Logger.info("🎉 All terminals are already installed.");
      return;
    }

    const selectedChoices = await this.promptForTerminal(notInstalled);

    for (const choice of selectedChoices) {
      const terminal = notInstalled.find((t) => t.value === choice);
      if (terminal) {
        await this.installTerminal(terminal.installCmd, terminal.name);
      } else {
        Logger.warn(`⚠️ Skipping unknown terminal choice: ${choice}`);
      }
    }

    Logger.info("✅ Terminal setup complete.");
  }
}
