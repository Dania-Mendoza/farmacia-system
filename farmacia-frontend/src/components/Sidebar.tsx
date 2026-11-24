'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  Users, 
  Building2, 
  Store,
  ShieldAlert
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard Auditoría', href: '/', icon: LayoutDashboard },
  { name: 'Inventario de Sedes', href: '/inventario', icon: Package },
  { name: 'Traslados Internos', href: '/movimientos', icon: ArrowLeftRight },
  { name: 'Punto de Venta', href: '/ventas', icon: ShoppingCart },
  { name: 'Flujo de Efectivo', href: '/flujo-efectivo', icon: DollarSign },
  { name: 'Entregas & Call Center', href: '/entregas', icon: Truck },
  { name: 'Planilla de Sueldos', href: '/planilla', icon: Users },
  { name: 'Activos Fijos', href: '/activos', icon: Building2 },
  { name: 'Sucursales & Stands', href: '/sucursales', icon: Store },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/50">
          +F
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white leading-tight">FarmaControl GT</h1>
          <p className="text-xs text-slate-400">Seminario - Cadena Nacional</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
        <div>
          <p className="font-semibold text-slate-200">Oracle 21c XE</p>
          <p>Nodo Local Conectado</p>
        </div>
      </div>
    </aside>
  );
}
