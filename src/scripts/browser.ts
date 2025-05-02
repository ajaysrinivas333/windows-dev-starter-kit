import { execAsync } from '../utils';
import checkbox from '@inquirer/checkbox';
import Logger from '../utils/logger';
import { BackgroundTask } from '../types';
import AbstractToolInstallationScript from './base-script';

export default class Browser extends AbstractToolInstallationScript {
    private static readonly BROWSERS = [
        {
            name: 'Google Chrome',
            value: 'chrome',
            checkCmd: `defaults read "/Applications/Google Chrome.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask google-chrome',
        },
        {
            name: 'Firefox',
            value: 'firefox',
            checkCmd: `defaults read "/Applications/Firefox.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask firefox',
        },
        {
            name: 'Brave',
            value: 'brave',
            checkCmd: `defaults read "/Applications/Brave Browser.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask brave-browser',
        },
        {
            name: 'Microsoft Edge',
            value: 'edge',
            checkCmd: `defaults read "/Applications/Microsoft Edge.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask microsoft-edge',
        },
    ];

    /** Main entry point */
    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking installed browsers...');

        const notInstalled = await this.findNotInstalledTools(this.BROWSERS);

        if (notInstalled.length === 0) {
            Logger.info('🎉 All browsers are already installed.');
            return;
        }

        const selectedChoices = await this.promptCheckbox(
            'Select the browsers you want to install',
            notInstalled
        );

        const browserMap = new Map(notInstalled.map((b) => [b.value, b]));

        for (const choice of selectedChoices) {
            const browser = browserMap.get(choice);
            if (browser) {
                backgroundTasks.push({
                    name: browser.name,
                    description: `${browser.name} Installation`,
                    getPromise: () =>
                        this.installTool(browser.installCmd, browser.name),
                });
            } else Logger.warn(`⚠️ Skipping unknown browser choice: ${choice}`);
        }
    }
}
