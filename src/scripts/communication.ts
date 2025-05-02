import checkbox from "@inquirer/checkbox";
import { execAsync } from "../utils";
import Logger from "../utils/logger";

export default class Communication {
  private static readonly apps = [
    {
      name: "Slack",
      value: "slack",
      description:
        "💬 Slack is widely used for developer and team collaboration with powerful integrations.",
      installCommand: "brew install --cask slack",
      checkCommand: `defaults read "/Applications/Slack.app/Contents/Info.plist" CFBundleShortVersionString`,
    },
    {
      name: "Discord",
      value: "discord",
      description:
        "🎮 Discord is a voice, video, and text communication tool popular among communities and dev teams.",
      installCommand: "brew install --cask discord",
      checkCommand: `defaults read "/Applications/Discord.app/Contents/Info.plist" CFBundleShortVersionString`,
    },
    {
      name: "Microsoft Teams",
      value: "teams",
      description:
        "👥 Microsoft Teams is a collaboration tool for chat, meetings, and file sharing, integrated with Microsoft 365.",
      installCommand: "brew install --cask microsoft-teams",
      checkCommand: `defaults read "/Applications/Microsoft Teams.app/Contents/Info.plist" CFBundleShortVersionString`,
    },
    {
      name: "Google Chat",
      value: "chat",
      description:
        "💬 Google Chat offers messaging for teams and organizations integrated with Google Workspace.",
      installCommand: "brew install --cask google-chat",
      checkCommand: `defaults read "/Applications/Google Chat.app/Contents/Info.plist" CFBundleShortVersionString`,
    },
  ];

  private static async tryCommand(command: string, log: boolean = false) {
    try {
      const result = await execAsync(command);
      if (log) console.log(result.stdout);
      return result.stdout;
    } catch (error) {
      return null;
    }
  }

  private static async checkAlreadyInstalledApps() {
    const notInstalled: typeof this.apps = [];

    for (const app of this.apps) {
      const version = await this.tryCommand(app.checkCommand);
      if (version) {
        Logger.info(`✅ ${app.name} is already installed (v${version.trim()}). Skipping.`);
      } else {
        notInstalled.push(app);
      }
    }

    return notInstalled;
  }

  private static async promptForAppInstallation(availableApps: typeof this.apps) {
    return await checkbox({
      message: "Select the communication apps you want to install:",
      choices: availableApps,
    });
  }

  private static async installApp(installCmd: string, name: string, checkCmd: string): Promise<void> {
    Logger.info(`🔧 Installing ${name}...`);
    try {
      await execAsync(installCmd);
      const version = await this.tryCommand(checkCmd);
      Logger.info(`✅ ${name} installed successfully${version ? ` (v${version.trim()})` : ""}.`);
    } catch (err: any) {
      Logger.error(`❌ Failed to install ${name}: ${err?.stderr || err?.message || err}`);
    }
  }

  public static async process() {
    Logger.info("💬 Installing communication apps...");

    const appsForInstallation = await this.checkAlreadyInstalledApps();

    if (appsForInstallation.length === 0) {
      Logger.log("✅ All available communication apps are already installed.");
      return;
    }

    const selected = await this.promptForAppInstallation(appsForInstallation);

    const appMap = new Map(appsForInstallation.map((app) => [app.value, app]));

    for (const appValue of selected) {
      const app = appMap.get(appValue);
      if (!app) {
        Logger.error(`Invalid app selected: ${appValue}`);
        continue;
      }
      await this.installApp(app.installCommand, app.name, app.checkCommand);
    }

    Logger.info("✅ Communication apps installation complete.");
  }
}
