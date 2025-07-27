// src/fonts.ts (or wherever you keep shared constants)
import localFont from 'next/font/local';
export const NotoSansThin = localFont({
  src: "../../public/Noto_Sans/static/NotoSans-Regular.ttf",
  weight: '100', // optional, if applicable
  style: 'normal', // optional
  variable: '--font-noto-thin', // optional for CSS variable use
  display: 'swap',
});
