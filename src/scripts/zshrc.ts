import { copyFile, appendFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import select from '@inquirer/select';
import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';

export default class Zshrc extends AbstractToolInstallationScript {
    private static readonly ZSHRC_PATH = path.join(
        process.env?.HOME || '',
        '.zshrc'
    );
    private static readonly BACKUP_PATH = path.join(
        process.env?.HOME || '',
        '.zshrc.backup'
    );
    private static readonly CONFIG_PATH = path.join(
        __dirname,
        '../config/.zshrc'
    );

    private static async zshrcExists(): Promise<boolean> {
        return existsSync(this.ZSHRC_PATH);
    }

    private static async backupZshrc(): Promise<void> {
        Logger.log('📦 Taking backup of .zshrc...');

        if (existsSync(this.BACKUP_PATH)) {
            const versionedBackupPath = path.join(
                process.env?.HOME || '',
                `.zshrc.backup.${Date.now()}`
            );
            Logger.log(
                `📁 Backup already exists. Creating versioned backup at: ${versionedBackupPath}`
            );
            await copyFile(this.ZSHRC_PATH, versionedBackupPath);
        } else {
            await copyFile(this.ZSHRC_PATH, this.BACKUP_PATH);
        }

        Logger.info('✅ Backup complete.');
    }

    private static async appendToZshrc(): Promise<void> {
        Logger.log('➕ Appending to .zshrc...');
        try {
            const newContent = await readFile(this.CONFIG_PATH, 'utf8');
            await appendFile(this.ZSHRC_PATH, newContent);
            Logger.info('✅ Append complete.');
        } catch (err) {
            Logger.error('❌ Failed to append to .zshrc:', err);
        }
    }

    private static async displayNewZshrc(): Promise<void> {
        const newContent = await readFile(this.CONFIG_PATH, 'utf8');
        Logger.info('📄 Displaying new .zshrc contents...');
        Logger.msg(newContent);
    }

    private static async promptForAppending(): Promise<'append' | 'display'> {
        return await select({
            message: 'Choose how you want to proceed.',
            choices: [
                {
                    name: 'Append to existing .zshrc file',
                    value: 'append',
                },
                {
                    name: 'Display the new config, I will manually copy-paste into .zshrc',
                    value: 'display',
                },
            ],
        });
    }

    private static async createZshrc(): Promise<void> {
        Logger.log('🔍 Creating .zshrc...');
        await copyFile(this.CONFIG_PATH, this.ZSHRC_PATH);
        Logger.info('✅ .zshrc created successfully.');
    }

    public static async process(): Promise<void> {
        Logger.log('🔍 Checking if .zshrc exists...');

        const exists = await this.zshrcExists();

        if (!exists) {
            Logger.error(
                '❌ .zshrc not found. Please create one before proceeding.'
            );
            const shouldCreateZshrc = await this.promptConfirm(
                'Do you want to create a new .zshrc file?'
            );
            if (shouldCreateZshrc) {
                await this.createZshrc();
            }
            return;
        }

        Logger.log('✅ Existing .zshrc found.');
        await this.backupZshrc();

        const choice = await this.promptForAppending();
        if (choice === 'append') await this.appendToZshrc();
        else await this.displayNewZshrc();
    }
}
