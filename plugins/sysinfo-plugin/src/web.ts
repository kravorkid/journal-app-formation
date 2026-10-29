import { WebPlugin } from '@capacitor/core';

import type { SysInfoPlugin, FreeSpaceResult, SysInfoResult } from './definitions';

export class SysInfoWeb extends WebPlugin implements SysInfoPlugin {
  async getInfo(): Promise<SysInfoResult> {
    return {
      manufacturer: 'web',
      model: navigator.userAgent,
      osVersion: 'n/a',
      sdkInt: 0,
    };
  }

  async getFreeSpace(): Promise<FreeSpaceResult> {
    return { freeBytes: 0 };
  }
}
