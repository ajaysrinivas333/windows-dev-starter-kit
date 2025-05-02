export interface BackgroundTask {
    name: string;
    description: string;
    getPromise: () => Promise<any>;
}