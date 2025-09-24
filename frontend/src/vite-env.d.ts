//frontend/src/vite-evn.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // thêm các biến khác ở đây nếu cần
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
