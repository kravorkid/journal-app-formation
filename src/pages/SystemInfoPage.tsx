import { useState } from "react"
import { Capacitor } from "@capacitor/core"
import type { FreeSpaceResult, SysInfoResult } from 'sysinfo-plugin'
import { getFreeSpace, getSysInfo } from '../services/sysinfo-plugin'
import { IonPage, IonContent, IonSpinner, IonText, IonList, IonItem, IonLabel, useIonViewWillEnter } from "@ionic/react"
import PageHeader from "../components/PageHeader"

const PLATFORM_LABELS: Record<string, string> = {
    android: 'Android',
    ios: 'iOS',
    web: 'Web',
}
const toMb = (bytes: number): string => `${(bytes / (1024 * 1024)).toFixed(2)}Mb`

export default function SystemInfoPage() {
    const platform = Capacitor.getPlatform()
    const [info, setInfo] = useState<SysInfoResult | null>(null)
    const [freeSpace, setFreeSpace] = useState<FreeSpaceResult | null>(null)
    const [error, setError] = useState<string | null>(null)

  useIonViewWillEnter(() => {
    setError(null)
    Promise.all([
      getSysInfo(),
      getFreeSpace(),
    ])
      .then(([sysInfo, freeSpace]) => {
        setInfo(sysInfo)
        setFreeSpace(freeSpace)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Info indisponible')
      })
  })

  const rows: [string, string][] = info ? [
    ['Fabricant', info?.manufacturer ?? ''],
    ['Modèle', info?.model ?? ''],
    ['Système', `${PLATFORM_LABELS[platform] ?? platform} ${info.osVersion}`],
    ...(platform === 'android' ? [['Niveau d\'API', String(info.sdkInt)]] as [string, string][] : []),
    ...(freeSpace && platform !== 'web' ? [['Espace libre', toMb(freeSpace.freeBytes)]] as [string, string][] : []),
  ] : []

  return (
    <IonPage>
      <PageHeader title="Informations système" />
      <IonContent>
        {error && (<IonText color="danger">{error}</IonText>
        )}
        {!info && !error && <IonSpinner className="ion-margin"></IonSpinner>}
        <IonList>
          {rows.map(([label, value]) => (
            <IonItem key={label}>
              <IonLabel>{label}</IonLabel>
              <IonText>{value}</IonText>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}
