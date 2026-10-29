import { SysInfo, type FreeSpaceResult, type SysInfoResult } from "sysinfo-plugin"

type Shape<T> = Record<keyof T, 'string' | 'number'>

function assertShape<T extends object>(method: string, value: T, shape: Shape<T>): T {
  for(const [key, type] of Object.entries(shape)) {
    if (typeof (value as Record<string, unknown>)[key] !== type) {
      throw new Error(`SysInfo.${method}: clef ${key} absent ou de type invalide`)
    }
  }
  return value
}

export async function getSysInfo(): Promise<SysInfoResult> {
    const info = await SysInfo.getInfo()
    return assertShape('getSysInfo', info, { manufacturer: 'string', model: 'string', osVersion: 'string', sdkInt: 'number'})
}

export async function getFreeSpace(): Promise<FreeSpaceResult> {
    const freeSpace = await SysInfo.getFreeSpace()
    return assertShape('getFreeSpace', freeSpace, { freeBytes: 'number'})
}
