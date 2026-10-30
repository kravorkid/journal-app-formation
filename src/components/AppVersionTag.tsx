import { Capacitor } from '@capacitor/core'
import { IonText } from '@ionic/react'
import { selectVersionLabel, useAppStore } from '../store/app-store'

export default function AppVersionTag() {
  const label = useAppStore(selectVersionLabel)

  return (
    <IonText color="medium" className="app-version-tag" data-testid="app-version-tag">
      {Capacitor.isNativePlatform() ? label : 'web'}
    </IonText>
  )
}
