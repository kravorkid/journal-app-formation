import { IonButton, IonIcon } from '@ionic/react'
import { ellipsisHorizontal, imageOutline } from 'ionicons/icons'
import type { Entry } from '../services/entries'
import { formatCoordinates, formatEntryDate } from '../utils/format'
import './EntryCard.css'

type EntryCardProps = {
  entry: Entry
  onOpen: (id: string) => void
  onMore: (id: string) => void
}

export default function EntryCard({ entry, onOpen, onMore }: EntryCardProps) {
  const coordinates = formatCoordinates(entry.lat, entry.lng)

  return (
    <div className="entry-card">
      <button type="button" className="entry-card__main" onClick={() => onOpen(entry.id)}>
        <div className="entry-card__thumb">
          {entry.photoUrl ? <img src={entry.photoUrl} alt="" loading="lazy" /> : <IonIcon icon={imageOutline} />}
        </div>

        <div className="entry-card__body">
          <h2 className="entry-card__title">{entry.title}</h2>
          <p className="entry-card__excerpt">{entry.note}</p>
          <p className="entry-card__meta">{formatEntryDate(entry.createdAt)}</p>
          {coordinates && <p className="entry-card__meta">{coordinates}</p>}
        </div>
      </button>

      <IonButton fill="clear" color="medium" aria-label="Plus d'actions" onClick={() => onMore(entry.id)}>
        <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
      </IonButton>
    </div>
  )
}
