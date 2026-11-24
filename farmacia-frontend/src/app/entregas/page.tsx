'use client';

import { useState } from 'react';
import { Truck, PhoneCall, Clock, CheckCircle, AlertTriangle, MapPin, Plus, X, User } from 'lucide-react';

export default function EntregasPage() {
  const [entregas, setEntregas] = useState([
    { ID: 101, CLIENTE: 'José Castillo', DIRECCION: 'Zona 15, Guatemala', SUCURSAL: 'CC Miraflores', REPARTIDOR: 'Pedro Ramírez', TIEMPO_ESTIMADO: '35 mins', ESTADO: 'EN_CAMINO', CANAL: 'Call Center' },
    { ID: 102, CLIENTE: 'Carmen Flores', DIRECCION: 'Zona 10, Guatemala', SUCURSAL: 'Oakland Mall', REPARTIDOR: 'Sin Asignar', TIEMPO_ESTIMADO: '50 mins', ESTADO: 'PENDIENTE', CANAL: 'Portal Web' },
    { ID: 103, CLIENTE: 'Miguel Torres', DIRECCION: 'Zona 7, Mixco', SUCURSAL: 'Shell Mixco (Stand)', REPARTIDOR: 'Pedro Ramírez', TIEMPO_ESTIMADO: '20 mins', ESTADO: 'PENDIENTE', CANAL: 'Teléfono' },
    { ID: 104, CLIENTE: 'Sandra Gómez', DIRECCION: 'Antigua Guatemala', SUCURSAL: 'Farmacia Antigua', REPARTIDOR: 'Juan Morales', TIEMPO_ESTIMADO: 'Completado', ESTADO: 'ENTREGADO', CANAL: 'Call Center' },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [cliente, setCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sucursal, setSucursal] = useState('CC Miraflores');
  const [repartidor, setRepartidor] = useState('Pedro Ramírez');
  const [canal, setCanal] = useState('Call Center');
  const [tiempoEstimado, setTiempoEstimado] = useState('30 mins');
  const [mensajeExito, setMensajeExito] = useState('');

  const sucursales = [
    'CC Miraflores',
    'Oakland Mall',
    'Shell Mixco (Stand)',
    'Pradera Concepción',
    'Farmacia Antigua',
    'Pradera Xela',
  ];

  const repartidores = [
    'Pedro Ramírez',
    'Juan Morales',
    'Carlos Mendoza',
    'Sin Asignar',
  ];

  const handleCrearOrden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.trim() || !direccion.trim()) {
      alert('Por favor ingrese nombre del cliente y dirección de entrega.');
      return;
    }

    const nuevoId = 100 + entregas.length + 1;
    const nuevaEntrega = {
      ID: nuevoId,
      CLIENTE: cliente.trim(),
      DIRECCION: direccion.trim(),
      SUCURSAL: sucursal,
      REPARTIDOR: repartidor,
      TIEMPO_ESTIMADO: tiempoEstimado,
      ESTADO: 'PENDIENTE',
      CANAL: canal,
    };

    setEntregas([nuevaEntrega, ...entregas]);
    setModalAbierto(false);
    setCliente('');
    setDireccion('');
    setMensajeExito(`¡Orden #ORD-${nuevoId} creada exitosamente en el sistema de entregas!`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const handleDespachar = (id: number) => {
    setEntregas(entregas.map(e => {
      if (e.ID === id) {
        if (e.ESTADO === 'PENDIENTE') {
          return { ...e, ESTADO: 'EN_CAMINO', REPARTIDOR: e.REPARTIDOR === 'Sin Asignar' ? 'Pedro Ramírez' : e.REPARTIDOR };
        } else if (e.ESTADO === 'EN_CAMINO') {
          return { ...e, ESTADO: 'ENTREGADO', TIEMPO_ESTIMADO: 'Completado' };
        }
      }
      return e;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit mb-2">
            <PhoneCall className="w-3.5 h-3.5" /> Call Center Centralizado & Despacho
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Coordinación de Entregas y Pedidos</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Asignación inteligente de pedidos según cercanía y disponibilidad de stock entre farmacias y stands para evitar entregas tardías.
          </p>
        </div>

        <button 
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva Orden de Entrega
        </button>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            {mensajeExito}
          </span>
          <button onClick={() => setMensajeExito('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid de Pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entregas.map((e) => (
          <div key={e.ID} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-slate-500">ORD-{e.ID}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  e.ESTADO === 'ENTREGADO' ? 'bg-emerald-100 text-emerald-800' :
                  e.ESTADO === 'EN_CAMINO' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {e.ESTADO}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-2">{e.CLIENTE}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {e.DIRECCION}
              </p>

              <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                <p><span className="font-semibold text-slate-700">Sede Asignada:</span> {e.SUCURSAL}</p>
                <p><span className="font-semibold text-slate-700">Repartidor:</span> {e.REPARTIDOR}</p>
                <p><span className="font-semibold text-slate-700">Canal:</span> {e.CANAL}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Tiempo: <strong className="text-slate-800">{e.TIEMPO_ESTIMADO}</strong>
              </span>

              {e.ESTADO === 'PENDIENTE' && (
                <button 
                  onClick={() => handleDespachar(e.ID)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800 transition-colors"
                >
                  Despachar
                </button>
              )}
              {e.ESTADO === 'EN_CAMINO' && (
                <button 
                  onClick={() => handleDespachar(e.ID)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium text-xs hover:bg-emerald-700 transition-colors"
                >
                  Marcar Entregado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear Nueva Orden */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Registrar Orden de Entrega a Domicilio</h3>
              </div>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearOrden} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre Completo del Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ej: Licda. Claudia Morales"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calzada Roosevelt, 14-20 Zona 11"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Sede / Stand Asignada
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Canal de Recepción
                  </label>
                  <select
                    value={canal}
                    onChange={(e) => setCanal(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Call Center">Call Center</option>
                    <option value="Portal Web">Portal Web</option>
                    <option value="Teléfono Directo">Teléfono Directo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Repartidor Asignado
                  </label>
                  <select
                    value={repartidor}
                    onChange={(e) => setRepartidor(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {repartidores.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tiempo Estimado
                  </label>
                  <select
                    value={tiempoEstimado}
                    onChange={(e) => setTiempoEstimado(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="20 mins">20 mins (Prioridad)</option>
                    <option value="35 mins">35 mins (Estándar)</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
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
                  <Plus className="w-4 h-4" /> Registrar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
