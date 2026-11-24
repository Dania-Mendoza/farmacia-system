import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'FarmaControl - Sistema Integral de Farmacias',
  description: 'Plataforma de gestión de farmacias, inventario, auditoría de efectivo, planilla y call center.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen bg-slate-100 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
