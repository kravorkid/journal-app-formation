import { IonButton, IonIcon, IonItem, IonLabel, IonNote, IonSpinner } from '@ionic/react'
import { locationOutline, refreshOutline } from 'ionicons/icons'
import type { Position } from '../services/location'
import { formatCoordinates } from '../utils/format'

type LocationFieldProps = {
  position: Position | null
  loading: boolean
  error: string | null
  onRefresh: () => void
}

export default function LocationField({ position, loading, error, onRefresh }: LocationFieldProps) {
  const coordinates = position ? formatCoordinates(position.lat, position.lng) : null

  return (
    <IonItem lines="none">
      <IonIcon aria-hidden="true" icon={locationOutline} slot="start" />
      <IonLabel>
        <h3>Position actuelle</h3>
        <IonNote color={error ? 'danger' : 'medium'}>{error ?? coordinates ?? 'Aucune position'}</IonNote>
      </IonLabel>
      <IonButton slot="end" fill="clear" aria-label="Actualiser la position" disabled={loading} onClick={onRefresh}>
        {loading ? <IonSpinner name="dots" /> : <IonIcon slot="icon-only" icon={refreshOutline} />}
      </IonButton>
    </IonItem>
  )
}
