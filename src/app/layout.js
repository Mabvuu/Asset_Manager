// src/app/layout.js
import './globals.css';
import LayoutShell from '../components/LayoutShell';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'Asset MVP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>
          <NavBar />
          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </LayoutShell>
      </body>
    </html>
  );
}
