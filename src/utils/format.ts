const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const timeFormat = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

export const formatEntryDate = (isoDate: string) => {
  const date = new Date(isoDate)
  return `${dateFormat.format(date)} — ${timeFormat.format(date)}`
}

export const formatCoordinates = (lat: number | null, lng: number | null) =>
  lat === null || lng === null ? null : `${lat.toFixed(4)}, ${lng.toFixed(4)}`

export const mapsUrl = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`
