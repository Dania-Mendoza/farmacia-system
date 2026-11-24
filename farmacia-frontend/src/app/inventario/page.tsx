'use client';

import { useEffect, useState } from 'react';
import { Package, Search, AlertCircle, Plus, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function InventarioPage() {
  const [inventario, setInventario] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [alertaFiltro, setAlertaFiltro] = useState('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Estados del formulario modal
  const [medicamento, setMedicamento] = useState('Acetaminofén 500mg');
  const [sucursal, setSucursal] = useState('CC Miraflores');
  const [cantidad, setCantidad] = useState(50);
  const [stockMinimo, setStockMinimo] = useState(15);
  const [stockMaximo, setStockMaximo] = useState(250);
  const [precioVenta, setPrecioVenta] = useState(15.00);

  const defaultItems = [
    { ID_INVENTARIO: 1, MEDICAMENTO: 'Acetaminofén 500mg', SUCURSAL: 'CC Miraflores', CANTIDAD: 150, STOCK_MINIMO: 20, STOCK_MAXIMO: 300, NIVEL_STOCK: 'NORMAL', PRECIO_VENTA: 15.00, VALOR_INVENTARIO: 2250.00 },
    { ID_INVENTARIO: 2, MEDICAMENTO: 'Ibuprofeno 400mg', SUCURSAL: 'CC Miraflores', CANTIDAD: 80, STOCK_MINIMO: 15, STOCK_MAXIMO: 200, NIVEL_STOCK: 'NORMAL', PRECIO_VENTA: 22.50, VALOR_INVENTARIO: 1800.00 },
    { ID_INVENTARIO: 3, MEDICAMENTO: 'Amoxicilina 500mg', SUCURSAL: 'Oakland Mall', CANTIDAD: 40, STOCK_MINIMO: 10, STOCK_MAXIMO: 100, NIVEL_STOCK: 'NORMAL', PRECIO_VENTA: 45.00, VALOR_INVENTARIO: 1800.00 },
    { ID_INVENTARIO: 4, MEDICAMENTO: 'Tabcin Antigripal', SUCURSAL: 'Shell Mixco (Stand)', CANTIDAD: 8, STOCK_MINIMO: 15, STOCK_MAXIMO: 100, NIVEL_STOCK: 'BAJO', PRECIO_VENTA: 16.50, VALOR_INVENTARIO: 132.00 },
    { ID_INVENTARIO: 5, MEDICAMENTO: 'Omeprazol 20mg', SUCURSAL: 'Pradera Xela', CANTIDAD: 6, STOCK_MINIMO: 10, STOCK_MAXIMO: 150, NIVEL_STOCK: 'BAJO', PRECIO_VENTA: 28.00, VALOR_INVENTARIO: 168.00 },
    { ID_INVENTARIO: 6, MEDICAMENTO: 'Vitamina C 1000mg', SUCURSAL: 'Farmacia Antigua', CANTIDAD: 60, STOCK_MINIMO: 10, STOCK_MAXIMO: 150, NIVEL_STOCK: 'NORMAL', PRECIO_VENTA: 35.00, VALOR_INVENTARIO: 2100.00 },
  ];

  async function cargarInventario() {
    const res = await fetchApi('/inventario');
    if (res.success && res.data && res.data.length > 0) {
      setInventario(res.data);
    } else {
      setInventario(defaultItems);
    }
  }

  useEffect(() => {
    cargarInventario();
  }, []);

  const sucursales = [
    'CC Miraflores',
    'Oakland Mall',
    'Shell Mixco (Stand)',
    'Pradera Concepción',
    'Farmacia Antigua',
    'Pradera Xela',
  ];

  const handleGuardarInventario = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = Number(cantidad);
    const minNum = Number(stockMinimo);
    const maxNum = Number(stockMaximo);
    const precioNum = Number(precioVenta);

    const nivel = cantNum <= minNum ? 'BAJO' : cantNum >= maxNum ? 'EXCESO' : 'NORMAL';
    const nuevoId = inventario.length + 1;

    const nuevoItem = {
      ID_INVENTARIO: nuevoId,
      MEDICAMENTO: medicamento,
      SUCURSAL: sucursal,
      CANTIDAD: cantNum,
      STOCK_MINIMO: minNum,
      STOCK_MAXIMO: maxNum,
      NIVEL_STOCK: nivel,
      PRECIO_VENTA: precioNum,
      VALOR_INVENTARIO: cantNum * precioNum,
    };

    setInventario([nuevoItem, ...inventario]);
    setModalAbierto(false);
    setMensajeExito(`¡Stock de ${medicamento} registrado con éxito en ${sucursal}!`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const itemsFiltrados = inventario.filter((item) => {
    const matchTexto = 
      item.MEDICAMENTO?.toLowerCase().includes(filtro.toLowerCase()) ||
      item.SUCURSAL?.toLowerCase().includes(filtro.toLowerCase());
    
    if (alertaFiltro === 'bajo') return matchTexto && item.NIVEL_STOCK === 'BAJO';
    if (alertaFiltro === 'normal') return matchTexto && item.NIVEL_STOCK === 'NORMAL';
    return matchTexto;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Control de Inventario por Sede</h1>
          <p className="text-slate-500 text-sm">Monitoreo de existencias en farmacias de centros comerciales y stands de gasolineras.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={cargarInventario} 
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refrescar
          </button>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> + Ingresar Stock / Ajuste
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

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar medicamento o sucursal..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setAlertaFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${alertaFiltro === 'todos' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setAlertaFiltro('bajo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${alertaFiltro === 'bajo' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}
          >
            Stock Crítico / Bajo
          </button>
          <button
            onClick={() => setAlertaFiltro('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${alertaFiltro === 'normal' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}
          >
            Nivel Normal
          </button>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Medicamento</th>
                <th className="px-5 py-3">Sucursal / Stand</th>
                <th className="px-5 py-3 text-right">Existencia</th>
                <th className="px-5 py-3 text-right">Mín / Máx</th>
                <th className="px-5 py-3 text-right">Precio Venta</th>
                <th className="px-5 py-3 text-right">Valor Total</th>
                <th className="px-5 py-3 text-center">Estado Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itemsFiltrados.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {item.MEDICAMENTO}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {item.SUCURSAL}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-800">
                    {item.CANTIDAD} uds
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-slate-500">
                    {item.STOCK_MINIMO} / {item.STOCK_MAXIMO}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-700">
                    Q {Number(item.PRECIO_VENTA).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                    Q {Number(item.VALOR_INVENTARIO || (item.CANTIDAD * item.PRECIO_VENTA)).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.NIVEL_STOCK === 'BAJO'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.NIVEL_STOCK === 'BAJO' ? <AlertCircle className="w-3 h-3" /> : null}
                      {item.NIVEL_STOCK}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ingreso de Stock */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Ingreso / Ajuste de Stock en Sede</h3>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarInventario} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del Medicamento
                </label>
                <input
                  type="text"
                  value={medicamento}
                  onChange={(e) => setMedicamento(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Sucursal o Stand
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Cantidad a Ingresar
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    required
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Precio Unitario Venta (Q)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(Number(e.target.value))}
                    required
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Stock Mínimo Alerta
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(Number(e.target.value))}
                    required
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockMaximo}
                    onChange={(e) => setStockMaximo(Number(e.target.value))}
                    required
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
                  <Plus className="w-4 h-4" /> Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
