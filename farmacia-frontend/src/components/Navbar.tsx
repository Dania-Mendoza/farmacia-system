'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, UserCircle2, CheckCircle, AlertTriangle, Truck, ArrowLeftRight, X } from 'lucide-react';

interface NotificationItem {
  id: number;
  tipo: 'alerta' | 'entrega' | 'traslado' | 'info';
  titulo: string;
  descripcion: string;
  hora: string;
  leida: boolean;
}

export default function Navbar() {
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState<NotificationItem[]>([
    {
      id: 1,
      tipo: 'alerta',
      titulo: 'Stock Crítico de Tabcin',
      descripcion: 'Quedan 8 unidades en Stand Shell Mixco (mínimo 15)',
      hora: 'Hace 5 min',
      leida: false,
    },
    {
      id: 2,
      tipo: 'entrega',
      titulo: 'Pedido Call Center #ORD-101',
      descripcion: 'Repartidor Pedro Ramírez en ruta hacia Zona 15',
      hora: 'Hace 18 min',
      leida: false,
    },
    {
      id: 3,
      tipo: 'traslado',
      titulo: 'Traslado Aprobado TRF-001',
      descripcion: '20 unidades de Amoxicilina en camino a Shell Mixco',
      hora: 'Hace 45 min',
      leida: false,
    },
    {
      id: 4,
      tipo: 'alerta',
      titulo: 'Stock Bajo de Omeprazol',
      descripcion: 'Quedan 6 unidades en Pradera Xela',
      hora: 'Hace 1 hora',
      leida: true,
    },
  ]);

  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar panel al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMostrarNotificaciones(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const marcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
  };

  const eliminarNotificacion = (id: number) => {
    setNotificaciones(notificaciones.filter(n => n.id !== id));
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar medicamento, sucursal, orden o empleado..."
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Oracle XE: Conexión Activa
        </div>

        {/* Campana de Notificaciones con Dropdown interactivo */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Notificaciones del Sistema"
            aria-label="Abrir notificaciones"
          >
            <Bell className="w-5 h-5" />
            {noLeidas > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                {noLeidas}
              </span>
            )}
          </button>

          {/* Menú Flotante de Notificaciones */}
          {mostrarNotificaciones && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm">Notificaciones de Auditoría</h3>
                  {noLeidas > 0 && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                      {noLeidas} nuevas
                    </span>
                  )}
                </div>
                {noLeidas > 0 && (
                  <button
                    onClick={marcarTodasLeidas}
                    className="text-xs text-slate-300 hover:text-white underline underline-offset-2"
                  >
                    Marcar leídas
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notificaciones.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                    No hay notificaciones pendientes
                  </div>
                ) : (
                  notificaciones.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex gap-3 items-start transition-colors hover:bg-slate-50 ${
                        !n.leida ? 'bg-emerald-50/40' : 'bg-white'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {n.tipo === 'alerta' && (
                          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                        {n.tipo === 'entrega' && (
                          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Truck className="w-4 h-4" />
                          </div>
                        )}
                        {n.tipo === 'traslado' && (
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <ArrowLeftRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-xs font-semibold ${!n.leida ? 'text-slate-900' : 'text-slate-700'}`}>
                            {n.titulo}
                          </p>
                          <button
                            onClick={() => eliminarNotificacion(n.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                            title="Eliminar notificación"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.descripcion}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.hora}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 font-medium">
                  Supervisión centralizada de sucursales & stands
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <UserCircle2 className="w-8 h-8 text-slate-400" />
          <div className="text-left text-sm leading-tight">
            <p className="font-semibold text-slate-800">Auditor Central</p>
            <p className="text-xs text-slate-500">Bolsa de Valores Audit Mode</p>
          </div>
        </div>
      </div>
    </header>
  );
}
