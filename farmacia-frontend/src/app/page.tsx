'use client';

import { useEffect, useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Truck, 
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    sucursales_activas: 6,
    medicamentos_registrados: 10,
    empleados_activos: 8,
    ventas_hoy: { cantidad: 24, monto: 3850.50 },
    alertas_stock_bajo: 2,
    entregas_pendientes: 4,
    valor_inventario: 45680.00,
    valor_activos_fijos: 48000.00,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const res = await fetchApi('/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header del Caso de Negocio */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 mb-2">
            Proyecto Estratégico Bolsa de Valores (Inversión US$5,000,000.00)
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Panel Consolidado de Control y Auditoría Nacional
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Supervisión integral de operaciones en centros comerciales, stands de gasolineras, flujo de efectivo y coordinación de entregas.
          </p>
        </div>
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-right shrink-0">
          <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Valoración Total Activos + Stock</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">
            Q {(stats.valor_inventario + stats.valor_activos_fijos).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Tarjetas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sucursales & Stands</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.sucursales_activas} sedes</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Auditadas
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ventas de Hoy</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              Q {stats.ventas_hoy?.monto?.toLocaleString('es-GT', { minimumFractionDigits: 2 }) || '0.00'}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stats.ventas_hoy?.cantidad || 0} transacciones</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alertas de Stock</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.alertas_stock_bajo} críticas</p>
            <p className="text-xs text-slate-500 mt-1">Bajo mínimo sugerido</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entregas & Call Center</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.entregas_pendientes} en ruta</p>
            <p className="text-xs text-slate-500 mt-1">Coordinación en tiempo real</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secciones de Auditoría RUP & Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por Sucursal */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Red de Expansión Territorial</h2>
              <p className="text-xs text-slate-500">Centros comerciales principales y stands estratégicos en gasolineras</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
              Estrategia RUP - Fase Construcción
            </span>
          </div>

          <div className="space-y-3">
            {[
              { nombre: 'Farmacia CC Miraflores (Zona 11)', tipo: 'Centro Comercial', stock: 450, estado: 'Óptimo' },
              { nombre: 'Farmacia Oakland Mall (Zona 10)', tipo: 'Centro Comercial', stock: 320, estado: 'Óptimo' },
              { nombre: 'Farmacia Shell Mixco (Calzada San Juan)', tipo: 'Stand Gasolinera', stock: 120, estado: 'Alerta Stock' },
              { nombre: 'Farmacia Pradera Concepción (Villa Nueva)', tipo: 'Centro Comercial', stock: 280, estado: 'Óptimo' },
              { nombre: 'Farmacia Antigua Guatemala (5a Av)', tipo: 'Local Standalone', stock: 210, estado: 'Óptimo' },
              { nombre: 'Farmacia Pradera Xela (Quetzaltenango)', tipo: 'Centro Comercial', stock: 195, estado: 'Alerta Stock' },
            ].map((suc, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{suc.nombre}</p>
                    <p className="text-xs text-slate-500">{suc.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    suc.estado === 'Óptimo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {suc.estado}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{suc.stock} unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auditoría Financiera */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Auditoría Financiera Activa</h2>
            <p className="text-xs text-slate-500 mb-4">Control estricto para preparación a bolsa de valores</p>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500">Valor Activos Fijos Auditados</p>
                <p className="text-lg font-bold text-slate-800">Q {stats.valor_activos_fijos?.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-0.5">Depreciación calculada según normativa</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500">Valor Total en Medicamentos</p>
                <p className="text-lg font-bold text-slate-800">Q {stats.valor_inventario?.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-0.5">Inventario distribuido en tiempo real</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500">Fondo de Inversión Asignado</p>
                <p className="text-lg font-bold text-emerald-600">US$ 5,000,000.00</p>
                <p className="text-xs text-slate-400 mt-0.5">Estrategia de expansión nacional</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Motor BD: Oracle Database XE</span>
            <span className="font-semibold text-emerald-600">Modo Audit ON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
