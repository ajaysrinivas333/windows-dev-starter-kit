import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import type { BackgroundTask } from '../types';

export default class Terminal extends AbstractToolInstallationScript {
    private static readonly TERMINALS = [
        {
            name: 'Alacritty',
            value: 'alacritty',
            installCmd: 'brew install --cask alacritty',
            checkCmd: 'command -v alacritty',
        },
        {
            name: 'iTerm2',
            value: 'iterm2',
            installCmd: 'brew install --cask iterm2',
            checkCmd: 'ls /Applications/iTerm.app',
        },
        {
            name: 'Hyper',
            value: 'hyper',
            installCmd: 'brew install --cask hyper',
            checkCmd: 'command -v hyper',
        },
        {
            name: 'Warp',
            value: 'warp',
            installCmd: 'brew install --cask warp',
            checkCmd: 'ls /Applications/Warp.app',
        },
        {
            name: 'WezTerm',
            value: 'wezterm',
            installCmd: 'brew install --cask wezterm',
            checkCmd: 'command -v wezterm',
        },
        {
            name: 'Kitty',
            value: 'kitty',
            installCmd: 'brew install --cask kitty',
            checkCmd: 'command -v kitty',
        },
    ];

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        const notInstalled = await this.findNotInstalledTools(this.TERMINALS);

        if (notInstalled.length === 0) {
            Logger.info('🎉 All terminals are already installed.');
            return;
        }

        const selectedChoices = await this.promptCheckbox(
            'Select the terminals you want to install',
            notInstalled
        );

        for (const choice of selectedChoices) {
            const terminal = notInstalled.find((t) => t.value === choice);
            if (terminal) {
                backgroundTasks.push({
                    name: terminal.name,
                    description: `${terminal.name} Installation`,
                    getPromise: () =>
                        this.installTool(terminal.installCmd, terminal.name),
                });
            } else
                Logger.warn(`⚠️ Skipping unknown terminal choice: ${choice}`);
        }
    }
}
