import { BackgroundTask } from '../types';
import { execAsync } from '../utils';
import Logger from '../utils/logger';
import checkbox from '@inquirer/checkbox';
import AbstractToolInstallationScript from './base-script';

export default class JsPackageManager extends AbstractToolInstallationScript {
    private static readonly packageManagers = [
        {
            name: 'yarn',
            value: 'yarn',
            checkCmd: 'yarn --version',
            installCmd: 'brew install yarn',
            description: '🔍 Yarn is a fast, reliable, and secure dependency manager for JavaScript and TypeScript.',
        },
        {
            name: 'pnpm',
            value: 'pnpm',
            checkCmd: 'pnpm --version',
            installCmd: 'brew install pnpm',
            description: '🔍 Pnpm is a fast, disk space efficient package manager for JavaScript and TypeScript.',
        },
    ];

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.info('🔍 Checking for JavaScript package managers...');

        const notInstalled = await this.findNotInstalledTools(
            this.packageManagers
        );

        if (notInstalled.length > 0) {
            const selectedPackageManagers = await this.promptCheckbox(
                'Select the package managers you want to install',
                notInstalled
            );
            const pkgManagerMap = new Map(
                notInstalled?.map((pm) => [pm.value, pm])
            );

            // For each selected package manager, we'll add a background task to the queue
            for (const packageManager of selectedPackageManagers) {
                const pkgManager = pkgManagerMap.get(packageManager);

                if (!pkgManager) {
                    Logger.error(
                        `Invalid package manager selected: ${packageManager}`
                    );
                    continue;
                }
                // Add the task to backgroundTasks array
                backgroundTasks.push({
                    name: pkgManager.name,
                    description: `${pkgManager.name} Installation`,
                    getPromise: () =>
                        this.installTool(
                            pkgManager.installCmd,
                            pkgManager.name
                        ),
                });
            }
        } else Logger.log('✅ All package managers are already installed.');
    }
}
