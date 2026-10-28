import { IonActionSheet } from '@ionic/react'
import { camera, imageOutline } from 'ionicons/icons'
import type { PhotoSource } from '../services/photo'

type PhotoSourceSheetProps = {
  isOpen: boolean
  onSelect: (source: PhotoSource) => void
  onDismiss: () => void
}

export default function PhotoSourceSheet({ isOpen, onSelect, onDismiss }: PhotoSourceSheetProps) {
  return (
    <IonActionSheet
      isOpen={isOpen}
      header="Ajouter une photo"
      buttons={[
        { text: 'Prendre une photo', icon: camera, handler: () => onSelect('camera') },
        { text: 'Choisir dans la galerie', icon: imageOutline, handler: () => onSelect('gallery') },
        { text: 'Annuler', role: 'cancel' },
      ]}
      onDidDismiss={onDismiss}
    />
  )
}
