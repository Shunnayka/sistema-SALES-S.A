import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface Producto {
  idProducto: string;
  descripcion: string;
  stockActual: number;
  stockMinimo: number;
}

interface Factura {
  numeroFactura: string;
  estado: string;
  total: number;
}

interface OrdenCompra {
  numeroOrden: string;
  estado: string;
}

export function DashboardPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [productosRes, facturasRes, ordenesRes] = await Promise.all([
        apiClient.get<Producto[]>('/productos'),
        apiClient.get<Factura[]>('/facturas'),
        apiClient.get<OrdenCompra[]>('/ordenes-compra'),
      ]);

      setProductos(productosRes.data);
      setFacturas(facturasRes.data);
      setOrdenes(ordenesRes.data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  const productosBajoStock = productos.filter((p) => p.stockActual <= p.stockMinimo);
  const facturasPendientes = facturas.filter((f) => f.estado === 'pendiente');
  const ordenesPendientes = ordenes.filter((o) => o.estado === 'pendiente');
  const totalVentasCanceladas = facturas
    .filter((f) => f.estado !== 'anulada')
    .reduce((sum, f) => sum + f.total, 0);

  return (
    <div>
      <h2>Panel principal</h2>

      <div className="cards">
        <div className="card">
          <span className="card-number">{productos.length}</span>
          <span>Productos registrados</span>
        </div>
        <div className="card">
          <span className="card-number">{productosBajoStock.length}</span>
          <span>Productos que necesitan reabastecimiento</span>
        </div>
        <div className="card">
          <span className="card-number">{facturasPendientes.length}</span>
          <span>Facturas pendientes</span>
        </div>
        <div className="card">
          <span className="card-number">{ordenesPendientes.length}</span>
          <span>Ordenes de compra pendientes</span>
        </div>
        <div className="card">
          <span className="card-number">${totalVentasCanceladas.toFixed(2)}</span>
          <span>Total facturado (no anulado)</span>
        </div>
      </div>

      {productosBajoStock.length > 0 && (
        <div className="panel">
          <h3>Productos con stock bajo</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripcion</th>
                <th>Stock Actual</th>
                <th>Stock Minimo</th>
              </tr>
            </thead>
            <tbody>
              {productosBajoStock.map((p) => (
                <tr key={p.idProducto}>
                  <td>{p.idProducto}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.stockActual}</td>
                  <td>{p.stockMinimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
