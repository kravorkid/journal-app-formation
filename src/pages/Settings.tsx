import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonToggle, useIonViewWillEnter } from '@ionic/react'
import { cameraOutline, informationCircleOutline, locationOutline, logOutOutline, settingsOutline } from 'ionicons/icons'
import PageHeader from '../components/PageHeader'
import PermissionItem from '../components/PermissionItem'
import { usePermissions } from '../hooks/use-permissions'
import { APP_VERSION } from '../config'
import { useAuthStore } from '../store/auth-store'
import { useSettingsStore } from '../store/settings-store'

export default function Settings() {
  const preciseLocation = useSettingsStore((state) => state.preciseLocation)
  const setPreciseLocation = useSettingsStore((state) => state.setPreciseLocation)
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const { states, refresh, enable } = usePermissions()

  useIonViewWillEnter(() => {
    void refresh()
  })

  return (
    <IonPage>
      <PageHeader title="Paramètres" />
      <IonContent>
        <IonList>
          <IonItem>
            <IonIcon aria-hidden="true" icon={locationOutline} slot="start" />
            <IonToggle checked={preciseLocation} onIonChange={(event) => setPreciseLocation(event.detail.checked)}>
              <IonLabel>
                <h3>Position précise</h3>
                <p>Utiliser la position précise pour vos entrées.</p>
              </IonLabel>
            </IonToggle>
          </IonItem>
          <IonItem routerLink="/settings/system-info" detail>
            <IonIcon aria-hidden="true" icon={informationCircleOutline} slot="start" />
            <IonLabel>
              <h3>Informations système</h3>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon aria-hidden="true" icon={settingsOutline} slot="start" />
            <IonLabel>
              <h3>Version de l'app</h3>
              <p>{APP_VERSION}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>Autorisations</IonListHeader>
          <PermissionItem icon={cameraOutline} label="Photo" state={states.camera} onEnable={() => enable('camera')} />
          <PermissionItem icon={locationOutline} label="Géolocalisation" state={states.location} onEnable={() => enable('location')} />
        </IonList>

        <div className="ion-padding">
          {user && <IonNote>Connecté en tant que {user.email}</IonNote>}
          <IonButton expand="block" color="medium" fill="outline" className="ion-margin-top" onClick={signOut}>
            <IonIcon slot="start" icon={logOutOutline} />
            Se déconnecter
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}
