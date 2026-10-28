import { Camera } from '@capacitor/camera'
import { ensurePermission } from './permissions'

class PermissionError extends Error {}

const MAX_SIZE = 1280
const QUALITY = 0.85

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Impossible de lire l'image."))
    image.src = src
  })

export async function photoToBase64(webPath: string): Promise<string> {
  const image = await loadImage(webPath)
  const ratio = Math.min(1, MAX_SIZE / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * ratio)
  canvas.height = Math.round(image.height * ratio)
  canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', QUALITY).split(',')[1]
}

export type PhotoSource = 'camera' | 'gallery'

export async function pickPhoto(source: PhotoSource): Promise<string | null> {
  try {
    if (source === 'camera') {
      if ((await ensurePermission('camera')) === 'denied') {
        throw new PermissionError()
      }
      const result = await Camera.takePhoto({ quality: 90 })
      return result.webPath ?? null
    }
    const { results } = await Camera.chooseFromGallery({ quality: 90, limit: 1, targetWidth: MAX_SIZE })
    return results?.[0]?.webPath ?? null
  } catch (error) {
    if (error instanceof PermissionError) throw new Error("Permission caméra refusée. Activez-la dans les réglages de l'app.")
    return null
  }
}
