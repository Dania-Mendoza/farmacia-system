'use client';

import { useState } from 'react';
import { Store, MapPin, Phone, Clock, Plus, X, CheckCircle2, Building2, Fuel } from 'lucide-react';

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState([
    { ID: 1, NOMBRE: 'Farmacia CC Miraflores', DIRECCION: 'CC Miraflores, Zona 11, Cdad. Guatemala', TIPO: 'Centro Comercial', TEL: '2222-0001', HORARIO: '08:00 - 20:00' },
    { ID: 2, NOMBRE: 'Farmacia Oakland Mall', DIRECCION: 'CC Oakland Mall, Zona 10, Cdad. Guatemala', TIPO: 'Centro Comercial', TEL: '2222-0002', HORARIO: '08:00 - 20:00' },
    { ID: 3, NOMBRE: 'Farmacia Shell Mixco (Stand)', DIRECCION: 'Gasolinera Shell, Calzada San Juan, Mixco', TIPO: 'Stand en Gasolinera', TEL: '2222-0003', HORARIO: '06:00 - 22:00' },
    { ID: 4, NOMBRE: 'Farmacia Pradera Concepción', DIRECCION: 'CC Pradera Concepción, Villa Nueva', TIPO: 'Centro Comercial', TEL: '2222-0004', HORARIO: '08:00 - 20:00' },
    { ID: 5, NOMBRE: 'Farmacia Antigua', DIRECCION: '5a Avenida Norte #22, Antigua Guatemala', TIPO: 'Local Independiente', TEL: '2222-0005', HORARIO: '08:00 - 19:00' },
    { ID: 6, NOMBRE: 'Farmacia Pradera Xela', DIRECCION: 'CC Pradera Xela, Quetzaltenango', TIPO: 'Centro Comercial', TEL: '2222-0006', HORARIO: '08:00 - 20:00' },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipo, setTipo] = useState('Stand en Gasolinera');
  const [telefono, setTelefono] = useState('');
  const [horario, setHorario] = useState('06:00 - 22:00');
  const [mensajeExito, setMensajeExito] = useState('');

  const tiposDisponibles = [
    { label: 'Centro Comercial', icon: Building2 },
    { label: 'Stand en Gasolinera', icon: Fuel },
    { label: 'Local Independiente', icon: Store },
  ];

  const handleCrearSucursal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim()) {
      alert('Por favor complete el nombre y la dirección de la nueva sede.');
      return;
    }

    const nuevoId = sucursales.length + 1;
    const nuevaSede = {
      ID: nuevoId,
      NOMBRE: nombre.trim(),
      DIRECCION: direccion.trim(),
      TIPO: tipo,
      TEL: telefono.trim() || '2222-000' + nuevoId,
      HORARIO: horario.trim() || '08:00 - 20:00',
    };

    setSucursales([...sucursales, nuevaSede]);
    setModalAbierto(false);
    setNombre('');
    setDireccion('');
    setTelefono('');
    setMensajeExito(`¡${tipo === 'Stand en Gasolinera' ? 'Stand' : 'Sucursal'} "${nuevaSede.NOMBRE}" registrada exitosamente en el sistema!`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Red de Sucursales y Stands</h1>
          <p className="text-slate-500 text-sm">Distribución geográfica de puntos de venta en departamentos y gasolineras.</p>
        </div>

        <button 
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Registrar Nueva Sucursal / Stand
        </button>
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

      {/* Grid de Sedes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sucursales.map((s) => (
          <div key={s.ID} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                s.TIPO === 'Centro Comercial' ? 'bg-blue-100 text-blue-800' :
                s.TIPO === 'Stand en Gasolinera' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {s.TIPO}
              </span>
              <span className="text-xs text-slate-400 font-mono">SEDE-00{s.ID}</span>
            </div>

            <h3 className="font-bold text-base text-slate-900">{s.NOMBRE}</h3>

            <div className="space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {s.DIRECCION}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {s.TEL}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Horario: <strong>{s.HORARIO}</strong>
              </span>
              <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Auditado</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Registrar Nueva Sucursal / Stand */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Registrar Punto de Venta (Sucursal / Stand)</h3>
              </div>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearSucursal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre de la Sede o Stand
                </label>
                <input
                  type="text"
                  placeholder="Ej: Farmacia Texaco Roosevelt (Stand) o Farmacia CC Portales"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tipo de Ubicación
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Stand en Gasolinera">Stand en Gasolinera (Estrategia de rápida expansión)</option>
                  <option value="Centro Comercial">Centro Comercial (Punto de ancla departamental)</option>
                  <option value="Local Independiente">Local Independiente (Centro histórico/cabecera)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dirección y Departamento
                </label>
                <input
                  type="text"
                  placeholder="Ej: Gasolinera Texaco, Km 14 Calzada Roosevelt, Mixco"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 2222-0007"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 06:00 - 22:00"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
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
                  <Plus className="w-4 h-4" /> Registrar Punto de Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
