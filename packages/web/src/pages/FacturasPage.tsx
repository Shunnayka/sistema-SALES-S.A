import { useEffect, useState, type FormEvent } from 'react';
import { apiClient } from '../api/client';

interface DetalleFactura {
  numeroFactura: string;
  idProducto: string;
  cantidad: number;
  precioVenta: number;
  subtotal: number;
}

interface Factura {
  numeroFactura: string;
  fechaRegistro: string;
  idCliente: string;
  idVendedor: string;
  porcentajeIva: number;
  estado: 'pendiente' | 'cancelada' | 'anulada';
  fechaCancelacion: string | null;
  detalles: DetalleFactura[];
  total: number;
}

interface DetalleInput {
  idProducto: string;
  cantidad: string;
  precioVenta: string;
}

function emptyDetalle(): DetalleInput {
  return { idProducto: '', cantidad: '', precioVenta: '' };
}

export function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [numeroFactura, setNumeroFactura] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [idVendedor, setIdVendedor] = useState('');
  const [porcentajeIva, setPorcentajeIva] = useState('15');
  const [detalles, setDetalles] = useState<DetalleInput[]>([emptyDetalle()]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<Factura[]>('/facturas');
      setFacturas(data);
    } catch {
      setError('No se pudo cargar las facturas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateDetalle(index: number, patch: Partial<DetalleInput>) {
    setDetalles((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function addDetalle() {
    setDetalles((prev) => [...prev, emptyDetalle()]);
  }

  function removeDetalle(index: number) {
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await apiClient.post('/facturas', {
        numeroFactura,
        idCliente,
        idVendedor,
        porcentajeIva: Number(porcentajeIva),
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: Number(d.cantidad),
          precioVenta: Number(d.precioVenta),
        })),
      });

      setShowForm(false);
      setNumeroFactura('');
      setIdCliente('');
      setIdVendedor('');
      setPorcentajeIva('15');
      setDetalles([emptyDetalle()]);
      await load();
    } catch {
      setError('No se pudo registrar la venta. Verifique los datos e intente nuevamente.');
    }
  }

  async function handleCancelar(numero: string) {
    setError(null);
    try {
      await apiClient.post(`/facturas/${numero}/cancelar`);
      await load();
    } catch {
      setError('No se pudo cancelar la factura.');
    }
  }

  async function handleAnular(numero: string) {
    setError(null);
    try {
      await apiClient.post(`/facturas/${numero}/anular`);
      await load();
    } catch {
      setError('No se pudo anular la factura.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Facturas</h2>
        <button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cerrar' : 'Registrar venta'}</button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <label>
            Numero de factura
            <input value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} required />
          </label>
          <label>
            ID Cliente
            <input value={idCliente} onChange={(e) => setIdCliente(e.target.value)} required />
          </label>
          <label>
            ID Vendedor
            <input value={idVendedor} onChange={(e) => setIdVendedor(e.target.value)} required />
          </label>
          <label>
            Porcentaje IVA
            <input type="number" value={porcentajeIva} onChange={(e) => setPorcentajeIva(e.target.value)} required />
          </label>

          <h4>Detalles</h4>
          {detalles.map((detalle, index) => (
            <div className="detalle-row" key={index}>
              <input
                placeholder="ID Producto"
                value={detalle.idProducto}
                onChange={(e) => updateDetalle(index, { idProducto: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={detalle.cantidad}
                onChange={(e) => updateDetalle(index, { cantidad: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Precio de venta"
                value={detalle.precioVenta}
                onChange={(e) => updateDetalle(index, { precioVenta: e.target.value })}
                required
              />
              {detalles.length > 1 && (
                <button type="button" onClick={() => removeDetalle(index)}>
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDetalle}>
            Agregar detalle
          </button>

          <div className="form-actions">
            <button type="submit">Registrar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.numeroFactura}>
                <td>{factura.numeroFactura}</td>
                <td>{factura.idCliente}</td>
                <td>{factura.idVendedor}</td>
                <td>{factura.estado}</td>
                <td>{factura.total.toFixed(2)}</td>
                <td>
                  {factura.estado === 'pendiente' && (
                    <>
                      <button onClick={() => handleCancelar(factura.numeroFactura)}>Cancelar</button>
                      <button onClick={() => handleAnular(factura.numeroFactura)}>Anular</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
