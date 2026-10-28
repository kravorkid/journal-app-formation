import { Geolocation } from '@capacitor/geolocation'
import { ensurePermission } from './permissions'

export type Position = {
  lat: number
  lng: number
}

export async function getPosition(precise: boolean): Promise<Position> {
  if ((await ensurePermission('location')) === 'denied') {
    throw new Error('Permission de localisation refusée.')
  }
  const { coords } = await Geolocation.getCurrentPosition({ enableHighAccuracy: precise, timeout: 15_000 })
  return { lat: coords.latitude, lng: coords.longitude }
}
