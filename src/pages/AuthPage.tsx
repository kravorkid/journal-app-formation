import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { IonButton, IonContent, IonInput, IonInputPasswordToggle, IonPage, IonText, useIonViewWillEnter } from '@ionic/react'
import PageHeader from '../components/PageHeader'
import { useAuthStore, selectIsAuthenticated } from '../store/auth-store'

const MIN_PASSWORD_LENGTH = 6
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const signIn = useAuthStore((state) => state.signIn)
  const signUp = useAuthStore((state) => state.signUp)
  const clearError = useAuthStore((state) => state.clearError)
  const error = useAuthStore((state) => state.error)
  const status = useAuthStore((state) => state.status)

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loading = status === 'loading'
  const canSubmit = EMAIL_PATTERN.test(email.trim()) && password.length >= MIN_PASSWORD_LENGTH

  useIonViewWillEnter(() => {
    clearError()
    setPassword('')
  })

  const toggleMode = () => {
    setIsSignUp((current) => !current)
    clearError()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    const submit = isSignUp ? signUp : signIn
    await submit(email.trim(), password)
  }

  if (isAuthenticated) return <Navigate to="/entries" replace />

  return (
    <IonPage>
      <PageHeader title="Journal de terrain" />
      <IonContent className="ion-padding">
        <h1>{isSignUp ? 'Créer un compte' : 'Connexion'}</h1>
        <form onSubmit={handleSubmit} noValidate>
          <IonInput
            type="email"
            inputmode="email"
            autocomplete="email"
            label="E-mail"
            labelPlacement="floating"
            fill="outline"
            value={email}
            onIonInput={(event) => setEmail(event.detail.value ?? '')}
          />
          <IonInput
            type="password"
            autocomplete={isSignUp ? 'new-password' : 'current-password'}
            label="Mot de passe"
            labelPlacement="floating"
            fill="outline"
            className="ion-margin-top"
            value={password}
            onIonInput={(event) => setPassword(event.detail.value ?? '')}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          {error && <IonText color="danger"><p>{error}</p></IonText>}

          <IonButton type="submit" expand="block" className="ion-margin-top" disabled={loading || !canSubmit}>
            {loading ? 'Veuillez patienter...' : isSignUp ? 'Créer mon compte' : 'Se connecter'}
          </IonButton>
          <IonButton type="button" expand="block" fill="clear" color="medium" disabled={loading} onClick={toggleMode}>
            {isSignUp ? "J'ai déjà un compte" : 'Créer un compte'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}
