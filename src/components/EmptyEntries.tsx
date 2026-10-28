import { IonButton, IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons'
import './EmptyEntries.css'

export default function EmptyEntries({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="empty-entries">
      <svg viewBox="0 0 240 140" width="240" aria-hidden="true">
        <circle cx="190" cy="30" r="12" fill="var(--ion-color-step-100)" />
        <path d="M0 140 L70 40 L100 85 L125 55 L190 140 Z" fill="var(--ion-color-step-100)" />
        <path d="M110 140 L170 75 L240 140 Z" fill="var(--ion-color-step-150)" />
      </svg>

      <h2>Aucune entrée pour le moment</h2>
      <p>Commencez à explorer et à créer votre propre journal de terrain.</p>

      <IonButton shape="round" onClick={onCreate}>
        <IonIcon slot="start" icon={add} />
        Nouvelle entrée
      </IonButton>
    </div>
  )
}
