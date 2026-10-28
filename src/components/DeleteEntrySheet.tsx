import { IonActionSheet } from '@ionic/react'

type DeleteEntrySheetProps = {
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export default function DeleteEntrySheet({ isOpen, onConfirm, onDismiss }: DeleteEntrySheetProps) {
  return (
    <IonActionSheet
      isOpen={isOpen}
      header="Supprimer cette entrée ?"
      subHeader="Cette action est irréversible."
      buttons={[
        { text: 'Supprimer', role: 'destructive', handler: onConfirm },
        { text: 'Annuler', role: 'cancel' },
      ]}
      onDidDismiss={onDismiss}
    />
  )
}
