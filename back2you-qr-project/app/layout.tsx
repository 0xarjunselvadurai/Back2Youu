import './globals.css';

export const metadata = {
  title: 'Back2You QR Project',
  description: 'Recover your lost items with QR codes and NFC technology.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}