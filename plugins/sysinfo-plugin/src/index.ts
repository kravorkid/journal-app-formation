import { registerPlugin } from '@capacitor/core';

import type { SysInfoPlugin } from './definitions';

const SysInfo = registerPlugin<SysInfoPlugin>('SysInfo', {
  web: () => import('./web').then((m) => new m.SysInfoWeb()),
});

export * from './definitions';
export { SysInfo };
