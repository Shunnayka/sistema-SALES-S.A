// The API runs on the development machine's localhost, which is not
// reachable as "localhost" from an emulator or physical device:
// - Android emulator: use 10.0.2.2 (the emulator's alias for the host).
// - iOS simulator: localhost works because it shares the host's network.
// - Physical device (Expo Go): use the machine's LAN IP, e.g. 192.168.x.x.
// Adjust this constant for the environment you are testing against.
export const API_URL = 'http://10.0.2.2:3000';
