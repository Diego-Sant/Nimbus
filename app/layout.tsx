import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "Nimbus",
  description: "Seu armazenamento seguro nas nuvens. Organize, compartilhe e acesse seus arquivos de qualquer lugar, com facilidade e proteção. Simples, rápido e ao seu alcance.",
};

export default function RootLayout({ children }
  : Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="pt-BR">
      <body // eslint-disable-next-line tailwindcss/no-custom-classname
        className={`${poppins.variable} font-poppins antialiased`}
      >
        {children}
      </body>
    </html>
  );

}
