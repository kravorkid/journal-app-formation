import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react'
import { checkmarkCircle } from 'ionicons/icons'
import type { PermissionState } from '../services/permissions'

type PermissionItemProps = {
  icon: string
  label: string
  state: PermissionState
  onEnable: () => void
}

export default function PermissionItem({ icon, label, state, onEnable }: PermissionItemProps) {
  return (
    <IonItem>
      <IonIcon aria-hidden="true" icon={icon} slot="start" />
      <IonLabel>{label}</IonLabel>
      {state === 'granted' ? (
        <IonIcon aria-label="Autorisé" icon={checkmarkCircle} color="success" slot="end" />
      ) : (
        <IonButton slot="end" size="small" onClick={onEnable}>
          {state === 'denied' ? 'Ouvrir les réglages' : 'Activer'}
        </IonButton>
      )}
    </IonItem>
  )
}
