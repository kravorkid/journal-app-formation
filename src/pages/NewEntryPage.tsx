import { useState } from 'react'
import type { FormEvent } from 'react'
import { IonButton, IonContent, IonPage, IonText, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import EntryFields from '../components/EntryFields'
import LocationField from '../components/LocationField'
import PageHeader from '../components/PageHeader'
import PhotoPicker from '../components/PhotoPicker'
import { usePosition } from '../hooks/use-position'
import { getErrorMessage } from '../services/errors'
import { photoToBase64 } from '../services/photo'
import { useEntriesStore } from '../store/entries-store'

export default function NewEntryPage() {
  const router = useIonRouter()
  const addEntry = useEntriesStore((state) => state.addEntry)
  const { position, loading: locating, error: locationError, refresh } = usePosition()

  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSave = title.trim() !== '' && !saving

  useIonViewWillEnter(() => {
    setTitle('')
    setNote('')
    setPhoto(null)
    setError(null)
    void refresh()
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      const photoBase64 = photo ? await photoToBase64(photo) : null
      await addEntry(
        { title: title.trim(), note: note.trim(), lat: position?.lat ?? null, lng: position?.lng ?? null },
        photoBase64,
      )
      router.push('/entries', 'root')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <IonPage>
      <PageHeader title="Nouvelle entrée" backHref="/entries">
        <IonButton disabled={!canSave} onClick={handleSubmit}>
          {saving ? 'Envoi...' : 'Enregistrer'}
        </IonButton>
      </PageHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} noValidate>
          <PhotoPicker photo={photo} onChange={setPhoto} />
          <EntryFields title={title} note={note} onTitleChange={setTitle} onNoteChange={setNote} />
          <LocationField position={position} loading={locating} error={locationError} onRefresh={refresh} />
          {error && <IonText color="danger"><p>{error}</p></IonText>}
        </form>
      </IonContent>
    </IonPage>
  )
}
