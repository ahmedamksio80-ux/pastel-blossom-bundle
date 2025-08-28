import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cdf42ffa606c4bd2bc3886c44a852b29',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://cdf42ffa-606c-4bd2-bc38-86c44a852b29.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;