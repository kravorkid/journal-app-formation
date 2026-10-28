import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonNote, IonPage, IonText, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import { linkOutline, locationOutline, trashOutline } from 'ionicons/icons'
import DeleteEntrySheet from '../components/DeleteEntrySheet'
import EntryFields from '../components/EntryFields'
import EntryPhoto from '../components/EntryPhoto'
import PageHeader from '../components/PageHeader'
import PhotoSourceSheet from '../components/PhotoSourceSheet'
import { getErrorMessage } from '../services/errors'
import { photoToBase64, pickPhoto, type PhotoSource } from '../services/photo'
import { selectEntryById, useEntriesStore } from '../store/entries-store'
import { formatCoordinates, formatEntryDate, mapsUrl } from '../utils/format'

export default function EntryDetailPage() {
  const { id = '' } = useParams()
  const router = useIonRouter()
  const entry = useEntriesStore(selectEntryById(id))
  const loaded = useEntriesStore((state) => state.loaded)
  const fetchEntries = useEntriesStore((state) => state.fetchEntries)
  const editEntry = useEntriesStore((state) => state.editEntry)
  const changePhoto = useEntriesStore((state) => state.changePhoto)
  const removeEntry = useEntriesStore((state) => state.removeEntry)

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useIonViewWillEnter(() => {
    if (!loaded) void fetchEntries()
  })

  const startEditing = () => {
    if (!entry) return
    setTitle(entry.title)
    setNote(entry.note)
    setError(null)
    setEditing(true)
  }

  const save = async () => {
    setError(null)
    try {
      await editEntry(id, { title: title.trim(), note: note.trim() })
      setEditing(false)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const replacePhoto = async (source: PhotoSource) => {
    setError(null)
    try {
      const picked = await pickPhoto(source)
      if (picked) await changePhoto(id, await photoToBase64(picked))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const confirmDelete = async () => {
    try {
      await removeEntry(id)
      router.goBack()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const coordinates = entry ? formatCoordinates(entry.lat, entry.lng) : null

  return (
    <IonPage>
      <PageHeader title="Détail" backHref="/entries">
        {entry && (
          <IonButton onClick={editing ? save : startEditing} disabled={editing && title.trim() === ''}>
            {editing ? 'Enregistrer' : 'Modifier'}
          </IonButton>
        )}
      </PageHeader>
      <IonContent className="ion-padding">
        {entry && (
          <>
            <EntryPhoto src={entry.photoUrl} alt={entry.title} onEdit={editing ? () => setPhotoSheetOpen(true) : undefined} />

            {editing ? (
              <EntryFields title={title} note={note} onTitleChange={setTitle} onNoteChange={setNote} />
            ) : (
              <>
                <h1>{entry.title}</h1>
                <IonNote>{formatEntryDate(entry.createdAt)}</IonNote>
              </>
            )}

            {error && <IonText color="danger"><p>{error}</p></IonText>}

            <IonList inset>
              {coordinates && entry.lat !== null && entry.lng !== null && (
                <IonItem href={mapsUrl(entry.lat, entry.lng)} target="_blank" detail={false}>
                  <IonIcon aria-hidden="true" icon={locationOutline} slot="start" />
                  <IonLabel>
                    <h3>Coordonnées</h3>
                    <p>{coordinates}</p>
                  </IonLabel>
                  <IonIcon aria-hidden="true" icon={linkOutline} slot="end" />
                </IonItem>
              )}
              {!editing && (
                <IonItem lines="none">
                  <IonLabel className="ion-text-wrap">
                    <h3>Note</h3>
                    <p>{entry.note || 'Aucune note'}</p>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>

            <IonButton expand="block" color="medium" fill="outline" onClick={() => setConfirmOpen(true)}>
              <IonIcon slot="start" icon={trashOutline} />
              Supprimer
            </IonButton>
          </>
        )}

        {!entry && loaded && <IonText color="medium"><p>Cette entrée n'existe plus.</p></IonText>}

        <PhotoSourceSheet
          isOpen={photoSheetOpen}
          onSelect={replacePhoto}
          onDismiss={() => setPhotoSheetOpen(false)}
        />
        <DeleteEntrySheet isOpen={confirmOpen} onConfirm={confirmDelete} onDismiss={() => setConfirmOpen(false)} />
      </IonContent>
    </IonPage>
  )
}
