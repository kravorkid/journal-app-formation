import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.formation.journal',
  appName: 'journal',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      appId: 'com.formation.journal',
      version: '0.0.0',
      defaultChannel: 'production',
      autoUpdate: 'always',
      autoSplashscreen: true
    },
    SplashScreen: {
      launchAutoHide: false
    }
  }
};

export default config;
