// API URL resolution for the mobile client.
//
// Default: localhost, which works for Expo Web (browser on the same machine)
// and the iOS simulator (shares the host network).
//
// For other environments, override with the EXPO_PUBLIC_API_URL environment
// variable before running `expo start`:
//   - Android emulator: EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
//   - Physical device:  EXPO_PUBLIC_API_URL=http://<host-LAN-IP>:3000
//
// Expo automatically injects any variable prefixed with EXPO_PUBLIC_ into
// the bundle at build time, so no additional library is required.

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';