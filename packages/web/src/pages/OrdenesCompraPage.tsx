import { useEffect, useState, type FormEvent } from 'react';
import { apiClient } from '../api/client';

interface DetalleOrdenCompra {
  numeroOrden: string;
  idProducto: string;
  cantidadSolicitada: number;
}

interface OrdenCompra {
  numeroOrden: string;
  fechaRegistro: string;
  idProveedor: string;
  estado: 'pendiente' | 'atendida' | 'anulada';
  fechaAtencion: string | null;
  detalles: DetalleOrdenCompra[];
}

interface DetalleInput {
  idProducto: string;
  cantidadSolicitada: string;
}

function emptyDetalle(): DetalleInput {
  return { idProducto: '', cantidadSolicitada: '' };
}

export function OrdenesCompraPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [numeroOrden, setNumeroOrden] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [detalles, setDetalles] = useState<DetalleInput[]>([emptyDetalle()]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<OrdenCompra[]>('/ordenes-compra');
      setOrdenes(data);
    } catch {
      setError('No se pudo cargar las ordenes de compra.');
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
      await apiClient.post('/ordenes-compra', {
        numeroOrden,
        idProveedor,
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidadSolicitada: Number(d.cantidadSolicitada),
        })),
      });

      setShowForm(false);
      setNumeroOrden('');
      setIdProveedor('');
      setDetalles([emptyDetalle()]);
      await load();
    } catch {
      setError('No se pudo registrar la orden. Verifique los datos e intente nuevamente.');
    }
  }

  async function handleAtender(numero: string) {
    setError(null);
    try {
      await apiClient.post(`/ordenes-compra/${numero}/atender`);
      await load();
    } catch {
      setError('No se pudo marcar la orden como atendida.');
    }
  }

  async function handleAnular(numero: string) {
    setError(null);
    try {
      await apiClient.post(`/ordenes-compra/${numero}/anular`);
      await load();
    } catch {
      setError('No se pudo anular la orden.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Ordenes de Compra</h2>
        <button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cerrar' : 'Registrar orden'}</button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <label>
            Numero de orden
            <input value={numeroOrden} onChange={(e) => setNumeroOrden(e.target.value)} required />
          </label>
          <label>
            ID Proveedor
            <input value={idProveedor} onChange={(e) => setIdProveedor(e.target.value)} required />
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
                placeholder="Cantidad solicitada"
                value={detalle.cantidadSolicitada}
                onChange={(e) => updateDetalle(index, { cantidadSolicitada: e.target.value })}
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
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.numeroOrden}>
                <td>{orden.numeroOrden}</td>
                <td>{orden.idProveedor}</td>
                <td>{orden.estado}</td>
                <td>
                  {orden.estado === 'pendiente' && (
                    <>
                      <button onClick={() => handleAtender(orden.numeroOrden)}>Atender</button>
                      <button onClick={() => handleAnular(orden.numeroOrden)}>Anular</button>
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
