import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import type { BackgroundTask } from '../types';

export default class Editor extends AbstractToolInstallationScript {
    private static readonly EDITORS = [
        {
            value: 'code',
            name: 'Visual Studio Code',
            checkCmd: 'code -v',
            installCmd: 'brew install --cask visual-studio-code',
        },
        {
            value: 'cursor',
            name: 'Cursor',
            checkCmd: 'cursor -v',
            installCmd: 'brew install --cask cursor',
        },
        {
            value: 'intellij-ce',
            name: 'IntelliJ IDEA Community Edition',
            checkCmd: `defaults read "/Applications/IntelliJ IDEA CE.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask intellij-idea-ce',
        },
        {
            value: 'android-studio',
            name: 'Android Studio',
            checkCmd: `defaults read "/Applications/Android Studio.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask android-studio',
        },
        {
            value: 'xcode',
            name: 'Xcode',
            checkCmd: `xcodebuild -version`,
            installCmd: 'brew install --cask xcode',
        },
        {
            value: 'intellij-ultimate',
            name: 'IntelliJ IDEA Ultimate Edition',
            checkCmd: `defaults read "/Applications/IntelliJ IDEA Ultimate.app/Contents/Info.plist" CFBundleShortVersionString`,
            installCmd: 'brew install --cask intellij-idea-ultimate',
        },
    ];

    /** Public entry point */
    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing code editors...');

        const notInstalled = await this.findNotInstalledTools(this.EDITORS);

        if (notInstalled.length === 0) {
            Logger.info('🎉 All code editors are already installed.');
            return;
        }

        const selectedChoices = await this.promptCheckbox(
            'Select the code editors you want to install',
            notInstalled
        );

        for (const choice of selectedChoices) {
            const editor = notInstalled.find((e) => e.value === choice);
            if (editor) {
                backgroundTasks.push({
                    name: editor.name,
                    description: `${editor.name} Installation`,
                    getPromise: () =>
                        this.installTool(editor.installCmd, editor.name),
                });
            } else {
                Logger.warn(`⚠️ Skipping unknown editor choice: ${choice}`);
            }
        }
    }
}

