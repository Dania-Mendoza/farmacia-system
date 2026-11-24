'use client';

import { useState } from 'react';
import { Users, DollarSign, CheckCircle, Plus, X, CheckCircle2 } from 'lucide-react';

export default function PlanillaPage() {
  const [empleados, setEmpleados] = useState([
    { ID: 1, NOMBRE: 'Carlos Mendoza', PUESTO: 'Gerente General', SUCURSAL: 'CC Miraflores', SALARIO_BASE: 25000.00, BONIF: 250.00, IGSS: 1207.50, NETO: 24042.50 },
    { ID: 2, NOMBRE: 'María González', PUESTO: 'Gerente de Sucursal', SUCURSAL: 'CC Miraflores', SALARIO_BASE: 12000.00, BONIF: 250.00, IGSS: 579.60, NETO: 11670.40 },
    { ID: 3, NOMBRE: 'Juan Pérez', PUESTO: 'Farmacéutico Titular', SUCURSAL: 'CC Miraflores', SALARIO_BASE: 8000.00, BONIF: 250.00, IGSS: 386.40, NETO: 7863.60 },
    { ID: 4, NOMBRE: 'Ana López', PUESTO: 'Auxiliar de Farmacia', SUCURSAL: 'CC Miraflores', SALARIO_BASE: 4500.00, BONIF: 250.00, IGSS: 217.35, NETO: 4532.65 },
    { ID: 5, NOMBRE: 'Roberto García', PUESTO: 'Gerente de Sucursal', SUCURSAL: 'Oakland Mall', SALARIO_BASE: 12000.00, BONIF: 250.00, IGSS: 579.60, NETO: 11670.40 },
    { ID: 6, NOMBRE: 'Sandra Martínez', PUESTO: 'Farmacéutico Encargado', SUCURSAL: 'Shell Mixco (Stand)', SALARIO_BASE: 8000.00, BONIF: 250.00, IGSS: 386.40, NETO: 7863.60 },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('Farmacéutico Encargado');
  const [sucursal, setSucursal] = useState('Shell Mixco (Stand)');
  const [salarioBase, setSalarioBase] = useState(8000.00);
  const [mensajeExito, setMensajeExito] = useState('');

  const sucursales = [
    'CC Miraflores',
    'Oakland Mall',
    'Shell Mixco (Stand)',
    'Pradera Concepción',
    'Farmacia Antigua',
    'Pradera Xela',
  ];

  const puestos = [
    { nombre: 'Farmacéutico Encargado', salario: 8000.00 },
    { nombre: 'Auxiliar de Farmacia', salario: 4500.00 },
    { nombre: 'Cajero / Atención', salario: 4000.00 },
    { nombre: 'Repartidor Delivery', salario: 4000.00 },
    { nombre: 'Gerente de Sucursal', salario: 12000.00 },
  ];

  const handleCrearEmpleado = (e: React.FormEvent) => {
    e.preventDefault();
    const base = Number(salarioBase);
    const bonif = 250.00;
    const igss = base * 0.0483;
    const neto = base + bonif - igss;
    const nuevoId = empleados.length + 1;

    const nuevo = {
      ID: nuevoId,
      NOMBRE: nombre.trim(),
      PUESTO: puesto,
      SUCURSAL: sucursal,
      SALARIO_BASE: base,
      BONIF: bonif,
      IGSS: igss,
      NETO: neto,
    };

    setEmpleados([...empleados, nuevo]);
    setModalAbierto(false);
    setNombre('');
    setMensajeExito(`¡Colaborador "${nuevo.NOMBRE}" agregado a la planilla con cálculo automático de IGSS!`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const totalPlanilla = empleados.reduce((acc, cur) => acc + cur.NETO, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Auditoría de Planilla y Sueldos</h1>
          <p className="text-slate-500 text-sm">Control de nómina, bonificación incentivo de ley y retención de cuota IGSS.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
            <p className="text-xs uppercase text-emerald-800 font-semibold">Total Neto de Planilla Mensual</p>
            <p className="text-xl font-bold text-emerald-700">Q {totalPlanilla.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> + Agregar a Planilla
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
              <th className="px-5 py-3">Colaborador</th>
              <th className="px-5 py-3">Puesto</th>
              <th className="px-5 py-3">Sucursal Asignada</th>
              <th className="px-5 py-3 text-right">Salario Base</th>
              <th className="px-5 py-3 text-right">Bonif. Ley</th>
              <th className="px-5 py-3 text-right">IGSS (4.83%)</th>
              <th className="px-5 py-3 text-right">Salario Neto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {empleados.map((e) => (
              <tr key={e.ID} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-800">{e.NOMBRE}</td>
                <td className="px-5 py-3.5 text-slate-600">{e.PUESTO}</td>
                <td className="px-5 py-3.5 text-slate-600">{e.SUCURSAL}</td>
                <td className="px-5 py-3.5 text-right font-medium text-slate-700">Q {e.SALARIO_BASE.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right text-slate-500">Q {e.BONIF.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right text-rose-600">- Q {e.IGSS.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right font-bold text-emerald-600">Q {e.NETO.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Empleado a Planilla */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Registrar Colaborador en Planilla</h3>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearEmpleado} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre Completo del Colaborador
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Walter Cabrera"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Puesto
                  </label>
                  <select
                    value={puesto}
                    onChange={(e) => {
                      const p = e.target.value;
                      setPuesto(p);
                      const def = puestos.find(x => x.nombre === p);
                      if (def) setSalarioBase(def.salario);
                    }}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {puestos.map((p) => (
                      <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
                    ))}
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
                  Salario Base Mensual (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="3000"
                  value={salarioBase}
                  onChange={(e) => setSalarioBase(Number(e.target.value))}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Cálculo automático: +Q250.00 bonificación de ley, -4.83% IGSS laboral.
                </p>
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
                  <Plus className="w-4 h-4" /> Agregar a Planilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
