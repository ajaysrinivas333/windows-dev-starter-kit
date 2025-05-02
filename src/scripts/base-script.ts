import { InstallableItem } from '../types';
import { execAsync } from '../utils';
import checkbox from '@inquirer/checkbox';
import Logger from '../utils/logger';
import select from '@inquirer/select';

export default abstract class AbstractToolInstallationScript {
    /** Run a check command and return stdout or null */
    protected static async runCommand(
        cmd: string,
        log: boolean = true
    ): Promise<string | null> {
        try {
            const { stdout } = await execAsync(cmd);
            if (log) Logger.msg(stdout.trim());
            return stdout.trim();
        } catch (err) {
            if (err instanceof Error) {
                Logger.error(`❌ Command failed: ${cmd}`, err.message);
            }
            return null;
        }
    }

    /** Install a given tool */
    protected static async installTool(
        installCmd: string,
        name: string
    ): Promise<void> {
        try {
            Logger.info(`🔧 Installing ${name}...`);
            const msg = await this.runCommand(installCmd);
            Logger.info(`✅ ${name} installed successfully.`);
        } catch (err) {
            Logger.error(`❌ Failed to install ${name}:`, err);
        }
    }

    /** Prompt the user to select multiple items from a list */
    protected static async promptCheckbox(
        label: string,
        items: Pick<InstallableItem, 'name' | 'description' | 'value'>[]
    ): Promise<string[]> {
        const selected = await checkbox({
            message: label,
            choices: items,
        });
        Logger.info(`Selected items: ${selected}`);
        return selected;
    }

    /** Prompt the user to confirm an action */
    protected static async promptConfirm(message: string): Promise<boolean> {
        const choice = await select({
            message: message,
            choices: [
                { name: 'Yes', value: 'yes' },
                { name: 'No', value: 'no' },
            ],
        });
        return choice === 'yes';
    }

    /** Find not installed tools from a list of installable tools */
    protected static async findNotInstalledTools(
        items: InstallableItem[]
    ): Promise<InstallableItem[]> {
        const notInstalled: InstallableItem[] = [];
        for (const item of items) {
            const version = await this.runCommand(item.checkCmd);
            if (version) {
                Logger.info(
                    `✅ ${
                        item.name
                    } is already installed (v${version.trim()}). Skipping.`
                );
            } else {
                notInstalled.push(item);
            }
        }
        return notInstalled;
    }
}
