import { IonButton, IonIcon, IonImg } from '@ionic/react'
import { closeCircle, pencil } from 'ionicons/icons'
import './EntryPhoto.css'

type EntryPhotoProps = {
  src: string | null
  alt: string
  onEdit?: () => void
  onRemove?: () => void
}

export default function EntryPhoto({ src, alt, onEdit, onRemove }: EntryPhotoProps) {
  if (!src && !onEdit) return null

  return (
    <div className="entry-photo">
      {src && <IonImg src={src} alt={alt} />}
      {onEdit && (
        <IonButton color="light" shape="round" aria-label="Modifier la photo" onClick={onEdit}>
          <IonIcon slot="icon-only" icon={pencil} />
        </IonButton>
      )}
      {onRemove && (
        <IonButton fill="clear" color="dark" aria-label="Retirer la photo" onClick={onRemove}>
          <IonIcon slot="icon-only" icon={closeCircle} />
        </IonButton>
      )}
    </div>
  )
}
