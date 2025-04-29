import { exec } from "child_process";
import os from "os";
import { promisify } from "util";

export const isMacOs = os.type() === "Darwin";

export const execAsync = promisify(exec);