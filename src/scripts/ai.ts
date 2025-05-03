import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import type { InstallableItem, BackgroundTask } from '../types';

export default class AITools extends AbstractToolInstallationScript {
    private static readonly AI_TOOLS: InstallableItem[] = [
        {
            name: 'ChatGPT',
            description: "OpenAI's official ChatGPT desktop application.",
            value: 'chatgpt',
            installCmd: 'brew install --cask chatgpt',
            checkCmd:
                'defaults read "/Applications/ChatGPT.app/Contents/Info.plist" CFBundleShortVersionString',
        },
        {
            name: 'Claude',
            description:
                "Anthropic's AI assistant. While there isn't an official brew cask for the Claude desktop app, you can install it by downloading the .dmg from their website.",
            value: 'claude',
            installCmd: 'brew install --cask claude',
            checkCmd: `defaults read "/Applications/Claude.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
    ];
    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing AI tools...');

        const notInstalled = await this.findNotInstalledTools(this.AI_TOOLS);

        if (notInstalled.length === 0) {
            Logger.log('No AI tools to install');
            return;
        }

        const selectedAItools = await this.promptCheckbox(
            'Select the AI tools you want to install',
            notInstalled
        );

        const toolMap = new Map<string, InstallableItem>(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const aiTool of selectedAItools) {
            const tool = toolMap.get(aiTool);

            if (!tool) {
                Logger.error(`Invalid AI tool selected: ${aiTool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${tool.name}`,
                description: `${tool.name} Installation`,
                getPromise: () => this.installTool(tool.installCmd, tool.name),
            });
        }
    }
}
