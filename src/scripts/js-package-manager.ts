import { BackgroundTask } from "../types";
import { execAsync } from "../utils";
import Logger from "../utils/logger";
import checkbox from "@inquirer/checkbox";


export default class JsPackageManager {

    private static readonly packageManagers = [
        {
            name: "yarn",
            value: "yarn",
            checkCmd: "yarn --version",
            installCmd: "brew install yarn",
        },
        {
            name: "pnpm",
            value: "pnpm",
            checkCmd: "pnpm --version",
            installCmd: "brew install pnpm",
        }
    ];

    private static async checkInstalledPackageManagers(): Promise<typeof this.packageManagers> {
        const notInstalled: typeof this.packageManagers = [];
        for (const packageManager of this.packageManagers) {
            const result = await this.verifyPackageManagerInstallation(packageManager.checkCmd, packageManager.name);
            if (!result) {
                notInstalled.push(packageManager);
            }
        }
        return notInstalled;
    }
    
    private static async verifyPackageManagerInstallation(cmd: string, name: string): Promise<string | null> {
        const result = await this.tryCommand(cmd);
        if (result) {
            Logger.info(`${name} ${result} is installed`);
        } else {
            Logger.msg(`${name} is not installed`);
        }
        return result;
    }

    private static async tryCommand(cmd: string, log: boolean = true): Promise<string | null> {
        try {
            const { stdout } = await execAsync(cmd);
            if (log) {
                Logger.info(stdout.trim());
            }
            return stdout.trim();
        } catch {
            return null;
        }
    }

    private static async promptPackageManagerInstallation(packageManagers: typeof this.packageManagers) {
        const selectedPackageManagers = await checkbox({
            message: "Select the package managers you want to install",
            choices: packageManagers.map((pm) => ({
                name: pm.name,
                value: pm,
                short: pm.name,
            })),
        });

        return selectedPackageManagers;
    }

    private static async installPackageManager(pkgManager: typeof this.packageManagers[number]): Promise<void> {
        Logger.log(`🔧 Installing ${pkgManager.name}...`);
        try {
            const msg = await this.tryCommand(pkgManager.installCmd);
            Logger.info(`✅ ${pkgManager.name} installed successfully.`);
        } catch (err) {
            Logger.error(`❌ Failed to install ${pkgManager.name}:`, err);
        }
    }

    public static async process(backgroundTasks: BackgroundTask[]): Promise<void> {
        Logger.info("🔍 Checking for JavaScript package managers...");
        const notInstalled = await this.checkInstalledPackageManagers();
        
        if (notInstalled.length > 0) {
            const selectedPackageManagers = await this.promptPackageManagerInstallation(notInstalled);
            const pkgManagerMap = new Map(notInstalled?.map((pm) => [pm.value, pm]));
            

            // For each selected package manager, we'll add a background task to the queue
            for (const  packageManager of selectedPackageManagers) {
                const pkgManager = pkgManagerMap.get(packageManager.value);
                if (!pkgManager) {
                    Logger.error(`Invalid package manager selected: ${packageManager.value}`);
                    continue;
                }

                // Add the task to backgroundTasks array
                backgroundTasks.push({
                    name: pkgManager.name,
                    description: `${pkgManager.name} Installation`,
                    getPromise: () => this.installPackageManager(pkgManager),
                });
            }
        } else {
            Logger.log("✅ All package managers are already installed.");
        }
    }
}
