import { useState } from 'react'
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react'
import { camera, imagesOutline } from 'ionicons/icons'
import EntryPhoto from './EntryPhoto'
import { pickPhoto, type PhotoSource } from '../services/photo'

type PhotoPickerProps = {
  photo: string | null
  onChange: (photo: string | null) => void
}

export default function PhotoPicker({ photo, onChange }: PhotoPickerProps) {
  const [error, setError] = useState<string | null>(null)

  const pick = async (source: PhotoSource) => {
    setError(null)
    try {
      const picked = await pickPhoto(source)
      if (picked) onChange(picked)
    } catch (err) {
      setError(err instanceof Error ? err.message : null)
    }
  }

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonCol>
            <IonButton expand="block" fill="outline" onClick={() => pick('camera')}>
              <IonIcon slot="start" icon={camera} />
              Prendre une photo
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand="block" fill="outline" onClick={() => pick('gallery')}>
              <IonIcon slot="start" icon={imagesOutline} />
              Choisir dans la galerie
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      {error && <IonText color="danger"><p>{error}</p></IonText>}

      {photo && <EntryPhoto src={photo} alt="Aperçu de la photo" onRemove={() => onChange(null)} />}
    </>
  )
}
