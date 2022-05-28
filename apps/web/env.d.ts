/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILDTRAY_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
