import { useState } from 'react'
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonText,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react'
import type { RefresherEventDetail } from '@ionic/react'
import { add, settingsOutline } from 'ionicons/icons'
import DeleteEntrySheet from '../components/DeleteEntrySheet'
import EmptyEntries from '../components/EmptyEntries'
import EntryCard from '../components/EntryCard'
import PageHeader from '../components/PageHeader'
import { getErrorMessage } from '../services/errors'
import { useEntriesStore } from '../store/entries-store'
import './EntriesPage.css'

export default function EntriesPage() {
  const router = useIonRouter()
  const entries = useEntriesStore((state) => state.entries)
  const loaded = useEntriesStore((state) => state.loaded)
  const loading = useEntriesStore((state) => state.loading)
  const error = useEntriesStore((state) => state.error)
  const fetchEntries = useEntriesStore((state) => state.fetchEntries)
  const removeEntry = useEntriesStore((state) => state.removeEntry)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useIonViewWillEnter(() => {
    void fetchEntries()
  })

  const goToNew = () => router.push('/new-entry')

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchEntries()
    event.detail.complete()
  }

  const confirmDelete = async () => {
    if (!selectedId) return
    setDeleteError(null)
    try {
      await removeEntry(selectedId)
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    }
  }

  const showSkeleton = loading && !loaded

  return (
    <IonPage>
      <PageHeader title="Journal de terrain">
        <IonButton aria-label="Paramètres" onClick={() => router.push('/settings')}>
          <IonIcon slot="icon-only" icon={settingsOutline} />
        </IonButton>
      </PageHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <h1 className="entries-title">Mes entrées</h1>

        {(error || deleteError) && (
          <IonText color="danger">
            <p>{deleteError ?? error}</p>
          </IonText>
        )}

        {showSkeleton && [0, 1, 2].map((key) => <IonSkeletonText key={key} animated className="entries-skeleton" />)}

        {loaded && entries.length === 0 && <EmptyEntries onCreate={goToNew} />}

        {entries.length > 0 && (
          <>
            <IonButton expand="block" shape="round" size="large" className="entries-new" onClick={goToNew}>
              <IonIcon slot="start" icon={add} />
              Nouvelle entrée
            </IonButton>

            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onOpen={(id) => router.push(`/entries/${id}`)}
                onMore={setSelectedId}
              />
            ))}
          </>
        )}

        <DeleteEntrySheet
          isOpen={selectedId !== null}
          onConfirm={confirmDelete}
          onDismiss={() => setSelectedId(null)}
        />
      </IonContent>
    </IonPage>
  )
}
