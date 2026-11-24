'use client';

import { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, Clock, Send, Plus, X } from 'lucide-react';

export default function MovimientosPage() {
  const [traslados, setTraslados] = useState([
    { ID: 1, MEDICAMENTO: 'Amoxicilina 500mg', ORIGEN: 'CC Miraflores', DESTINO: 'Shell Mixco (Stand)', CANTIDAD: 20, ESTADO: 'EN_TRANSITO', FECHA: '2026-11-23 09:30' },
    { ID: 2, MEDICAMENTO: 'Acetaminofén 500mg', ORIGEN: 'Oakland Mall', DESTINO: 'Pradera Xela', CANTIDAD: 50, ESTADO: 'PENDIENTE', FECHA: '2026-11-23 11:15' },
    { ID: 3, MEDICAMENTO: 'Vitamina C 1000mg', ORIGEN: 'Farmacia Antigua', DESTINO: 'Pradera Concepción', CANTIDAD: 15, ESTADO: 'RECIBIDO', FECHA: '2026-11-22 16:40' },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [medicamento, setMedicamento] = useState('Amoxicilina 500mg');
  const [origen, setOrigen] = useState('CC Miraflores');
  const [destino, setDestino] = useState('Shell Mixco (Stand)');
  const [cantidad, setCantidad] = useState(10);
  const [observaciones, setObservaciones] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const sucursales = [
    'CC Miraflores',
    'Oakland Mall',
    'Shell Mixco (Stand)',
    'Pradera Concepción',
    'Farmacia Antigua',
    'Pradera Xela',
  ];

  const medicamentosDisponibles = [
    'Acetaminofén 500mg',
    'Ibuprofeno 400mg',
    'Amoxicilina 500mg',
    'Loratadina 10mg',
    'Omeprazol 20mg',
    'Vitamina C 1000mg',
    'Tabcin Antigripal',
  ];

  const handleCrearTraslado = (e: React.FormEvent) => {
    e.preventDefault();
    if (origen === destino) {
      alert('La sucursal de origen y destino no pueden ser iguales.');
      return;
    }

    const nuevoId = traslados.length + 1;
    const nuevoTraslado = {
      ID: nuevoId,
      MEDICAMENTO: medicamento,
      ORIGEN: origen,
      DESTINO: destino,
      CANTIDAD: Number(cantidad),
      ESTADO: 'PENDIENTE',
      FECHA: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setTraslados([nuevoTraslado, ...traslados]);
    setModalAbierto(false);
    setMensajeExito(`¡Traslado TRF-00${nuevoId} solicitado con éxito! En espera de despacho.`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Traslado de Medicamentos entre Farmacias</h1>
          <p className="text-slate-500 text-sm">Control logístico para equilibrar existencias entre centros comerciales y stands en gasolineras.</p>
        </div>

        <button 
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" /> Solicitar Nuevo Traslado
        </button>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {mensajeExito}
          </span>
          <button onClick={() => setMensajeExito('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabla de Traslados */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Medicamento</th>
              <th className="px-5 py-3">Sucursal Origen</th>
              <th className="px-5 py-3">Sucursal Destino</th>
              <th className="px-5 py-3 text-right">Cantidad</th>
              <th className="px-5 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {traslados.map((t) => (
              <tr key={t.ID} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-slate-500">TRF-00{t.ID}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{t.MEDICAMENTO}</td>
                <td className="px-5 py-3.5 text-slate-600">{t.ORIGEN}</td>
                <td className="px-5 py-3.5 text-slate-600">{t.DESTINO}</td>
                <td className="px-5 py-3.5 text-right font-bold text-slate-900">{t.CANTIDAD} uds</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    t.ESTADO === 'RECIBIDO' ? 'bg-emerald-100 text-emerald-700' :
                    t.ESTADO === 'EN_TRANSITO' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.ESTADO === 'RECIBIDO' && <CheckCircle2 className="w-3 h-3" />}
                    {t.ESTADO === 'EN_TRANSITO' && <ArrowLeftRight className="w-3 h-3" />}
                    {t.ESTADO === 'PENDIENTE' && <Clock className="w-3 h-3" />}
                    {t.ESTADO}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Solicitar Nuevo Traslado */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Solicitar Traslado Inter-Sucursal</h3>
              </div>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearTraslado} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Medicamento a Transferir
                </label>
                <select
                  value={medicamento}
                  onChange={(e) => setMedicamento(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {medicamentosDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Sucursal Origen (Despacho)
                  </label>
                  <select
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {sucursales.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Sucursal Destino (Recepción)
                  </label>
                  <select
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {sucursales.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Cantidad de Unidades
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Observaciones / Justificación de Auditoría
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Reabastecimiento por stock crítico en stand de gasolinera..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Registrar Traslado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
