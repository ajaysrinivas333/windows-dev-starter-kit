import Logger from '../utils/logger';
import { BackgroundTask, InstallableItem } from '../types';
import AbstractToolInstallationScript from './base-script';

export default class Communication extends AbstractToolInstallationScript {
    private static readonly apps: InstallableItem[] = [
        {
            name: 'Slack',
            value: 'slack',
            description:
                '💬 Slack is widely used for developer and team collaboration with powerful integrations.',
            installCmd: 'brew install --cask slack',
            checkCmd: `defaults read "/Applications/Slack.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Discord',
            value: 'discord',
            description:
                '🎮 Discord is a voice, video, and text communication tool popular among communities and dev teams.',
            installCmd: 'brew install --cask discord',
            checkCmd: `defaults read "/Applications/Discord.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Microsoft Teams',
            value: 'teams',
            description:
                '👥 Microsoft Teams is a collaboration tool for chat, meetings, and file sharing, integrated with Microsoft 365.',
            installCmd: 'brew install --cask microsoft-teams',
            checkCmd: `defaults read "/Applications/Microsoft Teams.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Google Chat',
            value: 'chat',
            description:
                '💬 Google Chat offers messaging for teams and organizations integrated with Google Workspace.',
            installCmd: 'brew install --cask google-chat',
            checkCmd: `defaults read "/Applications/Google Chat.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
    ];

    public static async process(backgroundTasks: BackgroundTask[]) {
        Logger.info('💬 Installing communication apps...');

        const appsForInstallation = await this.findNotInstalledTools(this.apps);

        if (appsForInstallation.length === 0) {
            Logger.log(
                '✅ All available communication apps are already installed.'
            );
            return;
        }

        const selected = await this.promptCheckbox(
            'Select the communication apps you want to install',
            appsForInstallation
        );

        const appMap = new Map(
            appsForInstallation.map((app) => [app.value, app])
        );

        for (const appValue of selected) {
            const app = appMap.get(appValue);
            if (!app) {
                Logger.error(`Invalid app selected: ${appValue}`);
                continue;
            }
            backgroundTasks.push({
                name: app.name,
                description: `${app.name} Installation`,
                getPromise: () =>
                    this.installTool(app.installCmd, app.name),
            });
        }
    }
}
