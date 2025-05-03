import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import type { BackgroundTask, InstallableItem } from '../types';

export default class DatabaseClient extends AbstractToolInstallationScript {
    private static readonly DATABASE_CLIENTS: InstallableItem[] = [
        {
            name: 'DBeaver',
            description:
                'DBeaver is a free multi-platform database tool for developers, SQL programmers, database administrators, and analysts.',
            value: 'dbeaver',
            installCmd: 'brew install --cask dbeaver-community',
            checkCmd: `defaults read "/Applications/DBeaver.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'pgAdmin',
            description:
                'pgAdmin is an open-source administration and development platform for PostgreSQL.',
            value: 'pgadmin',
            installCmd: 'brew install --cask pgadmin4',
            checkCmd: `defaults read "/Applications/pgAdmin 4.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'TablePlus',
            description: 'TablePlus is a database management tool for macOS.',
            value: 'tableplus',
            installCmd: 'brew install --cask tableplus',
            checkCmd: `defaults read "/Applications/TablePlus.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'MongoDB Compass',
            description: 'MongoDB Compass is a GUI for MongoDB.',
            value: 'mongodb-compass',
            installCmd: 'brew install --cask mongodb-compass',
            checkCmd: `defaults read "/Applications/MongoDB Compass.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
    ];

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing database clients...');

        const notInstalled = await this.findNotInstalledTools(
            this.DATABASE_CLIENTS
        );
        if (notInstalled.length === 0) {
            Logger.log('No database clients to install');
            return;
        }

        const selectedDatabaseClients = await this.promptCheckbox(
            'Select the database clients you want to install',
            notInstalled
        );

        const databaseClientMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedDatabaseClients) {
            const databaseClient = databaseClientMap.get(tool);

            if (!databaseClient) {
                Logger.error(`Invalid database client selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${databaseClient.name}`,
                description: `${databaseClient.name} Installation`,
                getPromise: () =>
                    this.installTool(
                        databaseClient.installCmd,
                        databaseClient.name
                    ),
            });
        }
    }
}
