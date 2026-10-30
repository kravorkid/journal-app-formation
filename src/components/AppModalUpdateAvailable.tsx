import { useState } from 'react'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { IonButton, IonContent, IonModal, IonSpinner } from '@ionic/react'
import { selectIsBundleReady, useAppStore } from '../store/app-store'
import { selectIsAuthenticated, useAuthStore } from '../store/auth-store'

export default function AppModalUpdateAvailable() {
  const isReady = useAppStore(selectIsBundleReady)
  const pendingVersion = useAppStore((state) => state.pendingBundleVersion)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const [snoozedVersion, setSnoozedVersion] = useState<string | null>(null)
  const [restarting, setRestarting] = useState(false)
  const [error, setError] = useState(false)

  const isOpen = isReady && isAuthenticated && pendingVersion !== null && pendingVersion !== snoozedVersion

  const restart = async () => {
    setRestarting(true)
    setError(false)
    try {
      await CapacitorUpdater.reload()
    } catch {
      setError(true)
      setRestarting(false)
    }
  }

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false} data-testid="update-available-modal" className="update-available-modal">
      <IonContent className="ion-padding">
        <h2>Mise à jour disponible</h2>
        <p>La version {pendingVersion} est prête. Redémarrez l'application pour l'utiliser.</p>
        {error && <p>Le redémarrage a échoué. Réessayez.</p>}
        <IonButton expand="block" disabled={restarting} onClick={restart} data-testid="update-restart-button">
          {restarting ? <IonSpinner name="dots" /> : 'Redémarrer maintenant'}
        </IonButton>
        <IonButton
          expand="block"
          fill="clear"
          color="medium"
          disabled={restarting}
          onClick={() => setSnoozedVersion(pendingVersion)}
          data-testid="update-later-button"
        >
          Plus tard
        </IonButton>
      </IonContent>
    </IonModal>
  )
}
