import { IonInput, IonTextarea } from '@ionic/react'

export const NOTE_MAX_LENGTH = 500

type EntryFieldsProps = {
  title: string
  note: string
  onTitleChange: (title: string) => void
  onNoteChange: (note: string) => void
}

export default function EntryFields({ title, note, onTitleChange, onNoteChange }: EntryFieldsProps) {
  return (
    <>
      <IonInput
        label="Titre"
        labelPlacement="stacked"
        placeholder="Donnez un titre à votre entrée"
        value={title}
        onIonInput={(event) => onTitleChange(event.detail.value ?? '')}
      />
      <IonTextarea
        label="Note"
        labelPlacement="stacked"
        placeholder="Décrivez votre observation..."
        rows={4}
        counter
        maxlength={NOTE_MAX_LENGTH}
        value={note}
        onIonInput={(event) => onNoteChange(event.detail.value ?? '')}
      />
    </>
  )
}
