export interface BackgroundTask {
  name: string;
  description: string;
  getPromise: () => Promise<any>;
}

export interface InstallableItem {
  name: string;
  value: string;
  checkCmd: string;
  installCmd: string;
  description?: string;
}
