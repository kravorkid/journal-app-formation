export interface SysInfoResult {
  manufacturer: string;
  model: string;
  osVersion: string;
  sdkInt: number;
}

export interface FreeSpaceResult {
  freeBytes: number;
}

export interface SysInfoPlugin {
  getInfo(): Promise<SysInfoResult>;
  getFreeSpace(): Promise<FreeSpaceResult>;
}
