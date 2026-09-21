// The renderer (the shared React app from @sistema-sales/web) talks to the
// REST API directly over HTTP, the same way the browser-hosted web client
// does. No privileged Node/Electron APIs need to be bridged into the
// renderer, so this preload script intentionally exposes nothing.
