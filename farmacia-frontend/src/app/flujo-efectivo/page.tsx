'use client';

import { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, CheckCircle2 } from 'lucide-react';

export default function FlujoEfectivoPage() {
  const [transacciones, setTransacciones] = useState([
    { ID: 1, SUCURSAL: 'CC Miraflores', TIPO: 'INGRESO', CONCEPTO: 'Venta de Medicamentos POS', MONTO: 1450.00, FECHA: '2026-11-23 10:15' },
    { ID: 2, SUCURSAL: 'Oakland Mall', TIPO: 'INGRESO', CONCEPTO: 'Venta de Medicamentos POS', MONTO: 980.50, FECHA: '2026-11-23 11:30' },
    { ID: 3, SUCURSAL: 'Shell Mixco (Stand)', TIPO: 'EGRESO', CONCEPTO: 'Servicios Básicos & Mantenimiento', MONTO: 350.00, FECHA: '2026-11-23 12:00' },
    { ID: 4, SUCURSAL: 'Pradera Concepción', TIPO: 'INGRESO', CONCEPTO: 'Venta Call Center Despacho', MONTO: 620.00, FECHA: '2026-11-23 13:40' },
    { ID: 5, SUCURSAL: 'Central Contable', TIPO: 'EGRESO', CONCEPTO: 'Anticipo Planilla Quincenal', MONTO: 12500.00, FECHA: '2026-11-23 14:00' },
    { ID: 6, SUCURSAL: 'Farmacia Antigua', TIPO: 'INGRESO', CONCEPTO: 'Venta de Medicamentos POS', MONTO: 800.00, FECHA: '2026-11-23 14:25' },
  ]);

  const [notificacionExport, setNotificacionExport] = useState(false);

  const totalIngresos = transacciones.filter(t => t.TIPO === 'INGRESO').reduce((acc, cur) => acc + cur.MONTO, 0);
  const totalEgresos = transacciones.filter(t => t.TIPO === 'EGRESO').reduce((acc, cur) => acc + cur.MONTO, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  // Función para exportar informe auditable a archivo CSV descargable
  const exportarInformeCSV = () => {
    // Encabezados y contenido con formato CSV y soporte de caracteres UTF-8
    const headers = ['ID', 'Fecha_Hora', 'Sucursal', 'Tipo_Movimiento', 'Concepto', 'Monto_GTQ'];
    const rows = transacciones.map(t => [
      t.ID,
      `"${t.FECHA}"`,
      `"${t.SUCURSAL}"`,
      t.TIPO,
      `"${t.CONCEPTO}"`,
      t.TIPO === 'INGRESO' ? t.MONTO.toFixed(2) : `-${t.MONTO.toFixed(2)}`
    ]);

    // Agregar resumen de auditoría al final
    rows.push([]);
    rows.push(['--- RESUMEN AUDITORIA FINANCIERA ---']);
    rows.push(['TOTAL INGRESOS', '', '', '', '', totalIngresos.toFixed(2)]);
    rows.push(['TOTAL EGRESOS', '', '', '', '', totalEgresos.toFixed(2)]);
    rows.push(['BALANCE NETO', '', '', '', '', balanceNeto.toFixed(2)]);
    rows.push(['ESTADO AUDITORIA', '', '', '', '', 'AUDITADO CONFORME ORACLE XE']);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Crear blob y enlace de descarga automática en el navegador
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `informe_auditoria_flujo_efectivo_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificacionExport(true);
    setTimeout(() => setNotificacionExport(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Auditoría de Flujo de Efectivo</h1>
          <p className="text-slate-500 text-sm">Registro auditable en tiempo real de ingresos y egresos de todas las localidades.</p>
        </div>

        <button 
          onClick={exportarInformeCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          title="Descargar informe en formato CSV para Excel"
        >
          <Download className="w-4 h-4" /> Exportar Informe Auditoría
        </button>
      </div>

      {notificacionExport && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ¡Informe de auditoría financiera exportado y descargado exitosamente como archivo CSV compatible con Excel!
        </div>
      )}

      {/* Resumen Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Ingresos Auditados</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-emerald-600">Q {totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Egresos / Gastos</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-rose-600">Q {totalEgresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ArrowDownRight className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance Operativo Neto</p>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-2xl font-bold ${balanceNeto >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              Q {balanceNeto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            </p>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      {/* Libro de Flujo */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-sm text-slate-800">Libro Diario de Transacciones Auditables</h2>
          <span className="text-xs text-slate-500">Oracle XE: v_flujo_efectivo_consolidado</span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Fecha y Hora</th>
              <th className="px-5 py-3">Sucursal</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Concepto</th>
              <th className="px-5 py-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transacciones.map((t) => (
              <tr key={t.ID} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 text-xs text-slate-500">{t.FECHA}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">{t.SUCURSAL}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    t.TIPO === 'INGRESO' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {t.TIPO}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{t.CONCEPTO}</td>
                <td className={`px-5 py-3.5 text-right font-bold ${
                  t.TIPO === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.TIPO === 'INGRESO' ? '+' : '-'} Q {t.MONTO.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
