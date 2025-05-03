import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import type { BackgroundTask, InstallableItem } from '../types';

export default class ApiClient extends AbstractToolInstallationScript {
    private static readonly API_TOOLS: InstallableItem[] = [
        {
            name: 'Postman',
            description:
                'Postman is an API client that allows you to test and develop APIs.',
            value: 'postman',
            installCmd: 'brew install --cask postman',
            checkCmd: `defaults read "/Applications/Postman.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Insomnia',
            description:
                'Insomnia is an API client that allows you to test and develop APIs.',
            value: 'insomnia',
            installCmd: 'brew install --cask insomnia',
            checkCmd: `defaults read "/Applications/Insomnia.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'HTTPie',
            description: 'HTTPie is a command-line HTTP client.',
            value: 'httpie',
            installCmd: 'brew install --cask httpie',
            checkCmd: `defaults read "/Applications/HTTPie.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
    ];

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing API tools...');

        const notInstalled = await this.findNotInstalledTools(this.API_TOOLS);
        if (notInstalled.length === 0) {
            Logger.log('No API tools to install');
            return;
        }

        const selectedApiTools = await this.promptCheckbox(
            'Select the API tools you want to install',
            notInstalled
        );

        const apiToolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedApiTools) {
            const apiTool = apiToolMap.get(tool);

            if (!apiTool) {
                Logger.error(`Invalid API tool selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${apiTool.name}`,
                description: `${apiTool.name} Installation`,
                getPromise: () =>
                    this.installTool(apiTool.installCmd, apiTool.name),
            });
        }
    }
}
