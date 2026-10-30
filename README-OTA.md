# Mises à jour OTA avec Capgo

Une mise à jour OTA (over the air) remplace le code web de l'app (le contenu de `dist/`) sans repasser par le Play Store ou l'App Store. Le code natif (plugins, manifeste, permissions) ne change pas : il faut un nouveau binaire pour ça.

Documentation officielle :

- Plugin updater : https://capgo.app/docs/plugins/updater/
- CLI : https://capgo.app/docs/cli/commands/
- Référence `bundle` : https://capgo.app/docs/cli/reference/bundle/
- Référence `channel` : https://capgo.app/docs/cli/reference/channel/

## Configuration de l'app

Dans `capacitor.config.ts` :

```ts
CapacitorUpdater: {
  appId: 'com.formation.journal',
  version: '0.0.0',
  defaultChannel: 'production',
  autoUpdate: 'always',
  autoSplashscreen: true
}
```

- `defaultChannel` : le canal que l'app interroge au démarrage.
- `autoUpdate: 'always'` : vérifie à chaque retour au premier plan et applique tout de suite. Ce mode demande `@capacitor/splash-screen` avec `launchAutoHide: false`.
- Dans l'app, `src/services/capgo-updater.ts` appelle `notifyAppReady()` en premier. Sans cet appel, Capgo considère le bundle cassé et revient à la version précédente après `appReadyTimeout`.

## Envoyer un bundle

1. Se connecter une fois (clé API dans le tableau de bord Capgo) :

```bash
npx @capgo/cli login <apikey>
```

2. Construire le web et synchroniser :

```bash
npm run build
npx cap sync
```

3. Envoyer le bundle :

```bash
npx @capgo/cli bundle upload com.formation.journal --bundle 1.0.3 --channel production
```

| Option | Rôle |
| --- | --- |
| `--bundle <version>` | Numéro de version du bundle. À passer toujours explicitement : la CLI ne le lit pas dans `capacitor.config`. Un numéro ne peut pas être réutilisé, même après suppression. |
| `--channel <nom>` | Canal auquel le bundle est rattaché. |
| `--path <dossier>` | Dossier à envoyer (par défaut le `webDir`). |
| `--delta` | N'envoie que les fichiers modifiés aux appareils. Recommandé avec `autoUpdate: 'always'`. |
| `--apikey <clé>` | Remplace la clé enregistrée par `login`. |

Exemple vers un canal de test :

```bash
npx @capgo/cli bundle upload com.formation.journal --bundle 1.0.3-beta.1 --channel beta
```

## Gérer les bundles et les canaux

```bash
npx @capgo/cli bundle list com.formation.journal
npx @capgo/cli bundle delete com.formation.journal --bundle 1.0.3
npx @capgo/cli channel list com.formation.journal
npx @capgo/cli channel add beta com.formation.journal
npx @capgo/cli channel set beta com.formation.journal --bundle 1.0.3-beta.1
npx @capgo/cli channel set beta com.formation.journal --self-assign
```

Options utiles de `channel set` : `--bundle <version>` (lie un bundle déjà envoyé), `--self-assign` (autorise les appareils à choisir ce canal), `--ios` / `--no-ios`, `--android` / `--no-android`, `--downgrade`, `--upgrade`, `--state default`.

## Vérifier sur l'appareil

Le tag de version en bas de l'écran et dans Paramètres s'affiche sous la forme `v1.0.2 b3 o1.0.3` :

- `v` : version native du binaire installé
- `b` : numéro de build du binaire
- `o` : version du bundle OTA réellement exécuté (`obuiltin` : le code livré dans le binaire)

Cycle de test : ouvrir l'app, la mettre en arrière-plan, attendre le téléchargement, revenir au premier plan. La modale « Mise à jour disponible » propose de redémarrer. Avec `server.url` défini (live reload), l'auto-update est désactivé et aucun événement n'est émis, c'est normal.

## Écouter les événements

Depuis le plugin 8.53, un seul listener `updaterEvent` reçoit tous les événements sous la forme `{ type, data }`. Les listeners par événement (`addListener('downloadComplete', …)`, etc.) sont dépréciés et seront supprimés en v9 : TypeScript les barre.

```ts
const handle = await CapacitorUpdater.addListener('updaterEvent', (event) => {
  switch (event.type) {
    case 'download':
      console.log(event.data.percent)
      break
    case 'downloadComplete':
      console.log('Bundle prêt', event.data.bundle.version)
      break
    case 'downloadFailed':
      console.warn('Échec', event.data.version)
      break
  }
})
await handle.remove()
```

`event.data` contient la même charge utile que l'ancien listener correspondant. `switch (event.type)` est typé : TypeScript connaît le contenu de `data` dans chaque `case`. `CapacitorUpdater.removeAllListeners()` retire tout au démontage.

| `event.type` | Quand | Utilisé dans l'app |
| --- | --- | --- |
| `download` | Progression du téléchargement (`percent`, `bundle`) | oui |
| `downloadComplete` | Téléchargement terminé (`bundle`) | oui |
| `updateAvailable` | Bundle téléchargé et mis en file pour le prochain démarrage (pas au début du téléchargement) | oui |
| `noNeedUpdate` | Déjà à jour | oui |
| `downloadFailed` | Échec du téléchargement (`version`) | oui |
| `updateFailed` | Le bundle a échoué à l'installation, émis au démarrage suivant après un retour arrière (`bundle`) | oui |
| `updateCheckResult` | Résultat de la vérification côté serveur (`up_to_date`, `blocked`, `failed`) | non |
| `breakingAvailable` | Mise à jour marquée incompatible avec le binaire installé (l'ancien `majorAvailable` en est un alias déprécié) | non |
| `set` | Un bundle vient d'être appliqué | non |
| `setNext` | Un bundle est programmé pour le prochain démarrage | non |
| `appReady` | `notifyAppReady()` a été pris en compte | non |
| `appReloaded` | L'app a été rechargée | non |
| `channelPrivate` | `setChannel` refusé : le canal n'autorise pas l'auto-affectation | non |
| `onFlexibleUpdateStateChange` | État d'une mise à jour du store Android (in-app update) | non |

Méthodes utiles : `current()` (bundle actif), `getNextBundle()` (bundle en attente), `reload()` (applique le bundle en attente), `list()` (bundles présents sur l'appareil).

## Tester des cas particuliers avec les canaux

`setChannel` affecte l'appareil à un canal depuis l'app, sans réinstaller. On peut ainsi recevoir un bundle de test sans toucher à `production`.

Prérequis côté serveur : le canal doit exister et autoriser l'auto-affectation.

```bash
npx @capgo/cli channel add beta com.formation.journal
npx @capgo/cli channel set beta com.formation.journal --self-assign
npx @capgo/cli bundle upload com.formation.journal --bundle 1.0.3-beta.1 --channel beta
```

Côté app :

```ts
import { CapacitorUpdater } from '@capgo/capacitor-updater'

await CapacitorUpdater.addListener('updaterEvent', (event) => {
  if (event.type === 'channelPrivate') {
    console.warn(`Canal "${event.data.channel}" inaccessible : ${event.data.message}`)
  }
})

await CapacitorUpdater.setChannel({ channel: 'beta', triggerAutoUpdate: true })

const { channel } = await CapacitorUpdater.getChannel()

await CapacitorUpdater.unsetChannel({ triggerAutoUpdate: true })
```

- `triggerAutoUpdate: true` lance tout de suite une vérification sur le nouveau canal.
- `unsetChannel` revient au canal par défaut (`defaultChannel`).
- `listChannels()` retourne les canaux auxquels l'appareil peut s'affecter.
- À appeler après une action de l'utilisateur (réglage « programme bêta »), pas au démarrage : pour le démarrage, utiliser `defaultChannel`.
- L'option `allowSetDefaultChannel: false` dans la config désactive `setChannel`.

Cas à essayer :

| Cas | Comment |
| --- | --- |
| Tester un bundle sans toucher aux utilisateurs | Envoyer sur `beta`, affecter son appareil avec `setChannel` |
| Retour arrière automatique | Envoyer un bundle dont le code ne lance jamais `notifyAppReady()` : l'app revient à la version précédente, `updateFailed` est émis au démarrage suivant |
| Un seul OS | `channel set beta … --no-ios` pour que seuls les appareils Android reçoivent le bundle |
| Canal refusé | Retirer `--self-assign`, appeler `setChannel` : l'appel échoue et `channelPrivate` est émis |
| Revenir à la normale | `unsetChannel` |
