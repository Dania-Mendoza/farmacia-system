'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function VentasPage() {
  const [carrito, setCarrito] = useState([
    { id: 1, nombre: 'Acetaminofén 500mg (Caja 20)', precio: 15.00, cantidad: 2 },
    { id: 2, nombre: 'Vitamina C 1000mg (Frasco 30)', precio: 35.00, cantidad: 1 },
  ]);

  const subtotal = carrito.reduce((acc, cur) => acc + cur.precio * cur.cantidad, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Punto de Venta (POS)</h1>
        <p className="text-slate-500 text-sm">Facturación de medicamentos con actualización inmediata del inventario y flujo de caja.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Catálogo de Productos Rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 1, nombre: 'Acetaminofén 500mg', precio: 15.00, stock: 150 },
              { id: 2, nombre: 'Ibuprofeno 400mg', precio: 22.50, stock: 80 },
              { id: 3, nombre: 'Amoxicilina 500mg', precio: 45.00, stock: 40 },
              { id: 4, nombre: 'Loratadina 10mg', precio: 12.00, stock: 100 },
              { id: 5, nombre: 'Omeprazol 20mg', precio: 28.00, stock: 60 },
              { id: 6, nombre: 'Vitamina C 1000mg', precio: 35.00, stock: 60 },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  const existe = carrito.find(c => c.id === p.id);
                  if (existe) {
                    setCarrito(carrito.map(c => c.id === p.id ? { ...c, cantidad: c.cantidad + 1 } : c));
                  } else {
                    setCarrito([...carrito, { id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 }]);
                  }
                }}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
              >
                <p className="font-semibold text-sm text-slate-900">{p.nombre}</p>
                <p className="text-xs text-slate-500 mt-1">Stock: {p.stock} uds</p>
                <p className="text-sm font-bold text-emerald-600 mt-2">Q {p.precio.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Factura / Checkout */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" /> Detalle de Venta
            </h2>

            <div className="space-y-3 mb-6">
              {carrito.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{item.nombre}</p>
                    <p className="text-xs text-slate-400">{item.cantidad} x Q {item.precio.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-800">Q {(item.cantidad * item.precio).toFixed(2)}</p>
                    <button
                      onClick={() => setCarrito(carrito.filter(c => c.id !== item.id))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Total a Cobrar:</span>
              <span className="text-emerald-600">Q {subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => alert(`Venta cobrada por Q ${subtotal.toFixed(2)}. Registrada en Flujo de Efectivo Oracle XE.`)}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-900/20"
            >
              Completar Venta y Facturar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
