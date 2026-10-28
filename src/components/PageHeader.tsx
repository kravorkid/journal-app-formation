import type { ReactNode } from 'react'
import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react'

type PageHeaderProps = {
  title: string
  backHref?: string
  children?: ReactNode
}

export default function PageHeader({ title, backHref, children }: PageHeaderProps) {
  return (
    <IonHeader>
      <IonToolbar>
        {backHref && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={backHref} text="" />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        {children && <IonButtons slot="end">{children}</IonButtons>}
      </IonToolbar>
    </IonHeader>
  )
}
