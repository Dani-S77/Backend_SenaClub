// vite-env.d.ts (en la raíz junto a tsconfig.json)
/// <reference types="vite/client" />

// Si quieres tipar explícitamente tus variables de entorno:
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // otras VITE_*
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }