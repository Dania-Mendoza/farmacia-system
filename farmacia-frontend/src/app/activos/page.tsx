'use client';

import { useState } from 'react';
import { Building2, Plus, X, CheckCircle2 } from 'lucide-react';

export default function ActivosPage() {
  const [activos, setActivos] = useState([
    { ID: 1, NOMBRE: 'Mostrador Principal de Despacho', CODIGO: 'ACT-001', CATEGORIA: 'Mobiliario y Equipo', SUCURSAL: 'CC Miraflores', ADQUISICION: 5000.00, DEPRECIACION: 1666.67, VALOR_ACTUAL: 3333.33, ESTADO: 'ACTIVO' },
    { ID: 2, NOMBRE: 'Computadora Terminal POS Táctil', CODIGO: 'ACT-002', CATEGORIA: 'Equipo de Cómputo', SUCURSAL: 'CC Miraflores', ADQUISICION: 8000.00, DEPRECIACION: 4444.44, VALOR_ACTUAL: 3555.56, ESTADO: 'ACTIVO' },
    { ID: 3, NOMBRE: 'Motocicleta Delivery de Pedidos', CODIGO: 'ACT-003', CATEGORIA: 'Vehículos', SUCURSAL: 'CC Miraflores', ADQUISICION: 15000.00, DEPRECIACION: 4500.00, VALOR_ACTUAL: 10500.00, ESTADO: 'ACTIVO' },
    { ID: 4, NOMBRE: 'Refrigerador de Cadena de Frío', CODIGO: 'ACT-004', CATEGORIA: 'Equipo Refrigeración', SUCURSAL: 'CC Miraflores', ADQUISICION: 12000.00, DEPRECIACION: 2000.00, VALOR_ACTUAL: 10000.00, ESTADO: 'ACTIVO' },
    { ID: 5, NOMBRE: 'Computadora Terminal POS Oakland', CODIGO: 'ACT-005', CATEGORIA: 'Equipo de Cómputo', SUCURSAL: 'Oakland Mall', ADQUISICION: 8000.00, DEPRECIACION: 3555.56, VALOR_ACTUAL: 4444.44, ESTADO: 'ACTIVO' },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Equipo Refrigeración');
  const [sucursal, setSucursal] = useState('Shell Mixco (Stand)');
  const [valorAdquisicion, setValorAdquisicion] = useState(6500.00);
  const [mensajeExito, setMensajeExito] = useState('');

  const sucursales = [
    'CC Miraflores',
    'Oakland Mall',
    'Shell Mixco (Stand)',
    'Pradera Concepción',
    'Farmacia Antigua',
    'Pradera Xela',
  ];

  const handleCrearActivo = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(valorAdquisicion);
    const nuevoId = activos.length + 1;
    const nuevoCodigo = `ACT-00${nuevoId}`;
    const deprec = val * 0.20; // 20% anual promedio
    const valActual = val - deprec;

    const nuevo = {
      ID: nuevoId,
      NOMBRE: nombre.trim(),
      CODIGO: nuevoCodigo,
      CATEGORIA: categoria,
      SUCURSAL: sucursal,
      ADQUISICION: val,
      DEPRECIACION: deprec,
      VALOR_ACTUAL: valActual,
      ESTADO: 'ACTIVO',
    };

    setActivos([...activos, nuevo]);
    setModalAbierto(false);
    setNombre('');
    setMensajeExito(`¡Activo Fijo "${nuevo.NOMBRE}" auditado y registrado bajo código ${nuevoCodigo}!`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const totalAdquisicion = activos.reduce((acc, cur) => acc + cur.ADQUISICION, 0);
  const totalDepreciacion = activos.reduce((acc, cur) => acc + cur.DEPRECIACION, 0);
  const totalActual = activos.reduce((acc, cur) => acc + cur.VALOR_ACTUAL, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Control de Activos Fijos y Depreciación</h1>
          <p className="text-slate-500 text-sm">Valoración patrimonial de equipos, mobiliario, vehículos y cadena de frío por sucursal.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 px-4 rounded-xl border border-slate-200 text-right shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">Valor en Libros Auditado</p>
            <p className="text-lg font-bold text-slate-900">Q {totalActual.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
          </div>
          <button 
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> + Registrar Activo Fijo
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-sm animate-in fade-in">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            {mensajeExito}
          </span>
          <button onClick={() => setMensajeExito('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Activo Fijo</th>
              <th className="px-5 py-3">Categoría</th>
              <th className="px-5 py-3">Sucursal</th>
              <th className="px-5 py-3 text-right">Adquisición</th>
              <th className="px-5 py-3 text-right">Deprec. Acumulada</th>
              <th className="px-5 py-3 text-right">Valor Actual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activos.map((a) => (
              <tr key={a.ID} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-500">{a.CODIGO}</td>
                <td className="px-5 py-3.5 font-bold text-slate-800">{a.NOMBRE}</td>
                <td className="px-5 py-3.5 text-slate-600">{a.CATEGORIA}</td>
                <td className="px-5 py-3.5 text-slate-600">{a.SUCURSAL}</td>
                <td className="px-5 py-3.5 text-right text-slate-700">Q {a.ADQUISICION.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right text-rose-600">- Q {a.DEPRECIACION.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right font-bold text-emerald-600">Q {a.VALOR_ACTUAL.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Activo */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Registrar Nuevo Activo Fijo Patrimonial</h3>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearActivo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Descripción del Activo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Nevera Médica para Insulinas o Stand Metálico"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Categoría
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Equipo Refrigeración">Equipo Refrigeración (Cadena Frío)</option>
                    <option value="Equipo de Cómputo">Equipo de Cómputo (Terminal POS)</option>
                    <option value="Mobiliario y Equipo">Mobiliario y Equipo (Stands/Mostrador)</option>
                    <option value="Vehículos">Vehículos (Flotilla Delivery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Sucursal Asignada
                  </label>
                  <select
                    value={sucursal}
                    onChange={(e) => setSucursal(e.target.value)}
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
                  Valor de Adquisición (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={valorAdquisicion}
                  onChange={(e) => setValorAdquisicion(Number(e.target.value))}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
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
                  <Plus className="w-4 h-4" /> Registrar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
