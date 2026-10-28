import { Capacitor } from '@capacitor/core'
import { Camera } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings'

export type PermissionKind = 'camera' | 'location'
export type PermissionState = 'granted' | 'prompt' | 'denied'

const normalize = (state: string): PermissionState => {
  if (state === 'granted') return 'granted'
  return state === 'prompt' || state === 'prompt-with-rationale' ? 'prompt' : 'denied'
}

export async function checkPermission(kind: PermissionKind): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) return 'granted'
  if (kind === 'camera') {
    return normalize((await Camera.checkPermissions()).camera)
  }
  return normalize((await Geolocation.checkPermissions()).location)
}

export async function requestPermission(kind: PermissionKind): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) return 'granted'
  if (kind === 'camera') {
    return normalize((await Camera.requestPermissions({ permissions: ['camera'] })).camera)
  }
  return normalize((await Geolocation.requestPermissions()).location)
}

export async function ensurePermission(kind: PermissionKind): Promise<'granted' | 'denied'> {
  let state = await checkPermission(kind)
  if (state === 'prompt') state = await requestPermission(kind)
  return state === 'granted' ? 'granted' : 'denied'
}

export async function openAppSettings(): Promise<void> {
  await NativeSettings.open({
    optionAndroid: AndroidSettings.ApplicationDetails,
    optionIOS: IOSSettings.App,
  })
}
