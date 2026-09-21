import { useState, type FormEvent } from 'react';
import { apiClient } from '../api/client';
import { CrudPage } from '../crud/CrudPage';
import { productoConfig } from '../config/entities';

export function ProductosPage() {
  const [idProducto, setIdProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAjustarStock(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const { data } = await apiClient.post(`/productos/${idProducto}/ajustar-stock`, {
        cantidad: Number(cantidad),
      });
      setMessage(`Stock actualizado. ${data.idProducto} ahora tiene ${data.stockActual} unidades.`);
      setIdProducto('');
      setCantidad('');
    } catch {
      setError('No se pudo ajustar el stock. Verifique el ID de producto y la cantidad.');
    }
  }

  return (
    <div>
      <CrudPage config={productoConfig} />

      <div className="panel">
        <h3>Ajustar stock</h3>
        <p>Use un valor positivo para incrementar el stock, o negativo para reducirlo.</p>
        <form className="inline-form" onSubmit={handleAjustarStock}>
          <label>
            ID Producto
            <input value={idProducto} onChange={(e) => setIdProducto(e.target.value)} required />
          </label>
          <label>
            Cantidad
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
          </label>
          <button type="submit">Ajustar</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
