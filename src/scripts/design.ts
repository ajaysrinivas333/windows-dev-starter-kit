import { BackgroundTask, InstallableItem } from "../types";
import Logger from "../utils/logger";
import AbstractToolInstallationScript from "./base-script";

export default class Design extends AbstractToolInstallationScript {
   
    private static readonly DESIGN_TOOLS : InstallableItem[] = [
        {
            name: 'Figma',
            description: 'Figma helps design and development teams build great products, together.',
            value: 'figma',
            installCmd: 'brew install --cask figma',
            checkCmd: `defaults read "/Applications/Figma.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: "Sketch",
            description: "Sketch is a toolkit made by designers, for designers, that puts the focus on you and your work.",
            value: "sketch",
            installCmd: 'brew install --cask sketch',
            checkCmd: `defaults read "/Applications/Sketch.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: "Zeplin",
            description: "Zeplin is a friction-free design to development tool made for how you work.",
            value: "zeplin",
            installCmd: 'brew install --cask zeplin',
            checkCmd: `defaults read "/Applications/Zeplin.app/Contents/Info.plist" CFBundleShortVersionString`,
        }
    ];

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing design tools...');

        const notInstalled = await this.findNotInstalledTools(
            this.DESIGN_TOOLS
        );


        if (notInstalled.length === 0) {
            Logger.log('No design tools to install');
            return;
        }

        const selectedDesignTools = await this.promptCheckbox(
            'Select the design tools you want to install',
            notInstalled
        );

        const designToolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedDesignTools) {
            const designTool = designToolMap.get(tool);

            if (!designTool) {
                Logger.error(`Invalid design tool selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${designTool.name}`,
                description: `${designTool.name} Installation`,
                getPromise: () => this.installTool(designTool.installCmd, designTool.name),
            });
        }
    }


}