import { useEffect } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { homeOutline, addCircleOutline, settingsOutline } from 'ionicons/icons'

import AuthPage from './pages/AuthPage'
import Settings from './pages/Settings'
import EntriesPage from './pages/EntriesPage'
import EntryDetailPage from './pages/EntryDetailPage'
import NewEntryPage from './pages/NewEntryPage'
import RequireAuth from './components/RequireAuth'
import { useAuthStore, selectIsAuthenticated } from './store/auth-store'

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const restoreSession = useAuthStore((state) => state.restoreSession)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  useEffect(() => {
    void restoreSession()
  }, [restoreSession])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/" element={<Navigate to="/entries" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/entries" element={<RequireAuth><EntriesPage /></RequireAuth>} />
            <Route path="/entries/:id" element={<RequireAuth><EntryDetailPage /></RequireAuth>} />
            <Route path="/new-entry" element={<RequireAuth><NewEntryPage /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom" style={isAuthenticated ? undefined : { display: 'none' }}>
            <IonTabButton tab="entries" href="/entries">
              <IonIcon icon={homeOutline} />
              <IonLabel>Entrées</IonLabel>
            </IonTabButton>
            <IonTabButton tab="new-entry" href="/new-entry">
              <IonIcon icon={addCircleOutline} />
              <IonLabel>Nouvelle</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Paramètres</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
