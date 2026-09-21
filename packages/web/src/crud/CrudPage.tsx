import { useEffect, useState, type FormEvent } from 'react';
import { apiClient } from '../api/client';
import type { EntityConfig } from './types';

type Row = Record<string, unknown>;

function emptyForm(config: EntityConfig): Record<string, string> {
  const form: Record<string, string> = {};

  for (const field of config.fields) {
    form[field.key] = field.type === 'checkbox' ? 'false' : '';
  }

  return form;
}

function toRequestBody(config: EntityConfig, form: Record<string, string>): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  for (const field of config.fields) {
    const raw = form[field.key];

    if (field.type === 'number') {
      body[field.key] = raw === '' ? undefined : Number(raw);
    } else if (field.type === 'checkbox') {
      body[field.key] = raw === 'true';
    } else {
      body[field.key] = raw;
    }
  }

  return body;
}

export function CrudPage({ config }: { config: EntityConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(() => emptyForm(config));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<Row[]>(config.apiPath);
      setRows(data);
    } catch {
      setError('No se pudo cargar la informacion.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    setForm(emptyForm(config));
    setEditingId(null);
    setShowForm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiPath]);

  function startCreate() {
    setForm(emptyForm(config));
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(row: Row) {
    const next: Record<string, string> = {};

    for (const field of config.fields) {
      const value = row[field.key];
      next[field.key] = value === null || value === undefined ? '' : String(value);
    }

    setForm(next);
    setEditingId(String(row[config.idField]));
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const body = toRequestBody(config, form);

      if (editingId) {
        await apiClient.put(`${config.apiPath}/${editingId}`, body);
      } else {
        await apiClient.post(config.apiPath, body);
      }

      setShowForm(false);
      await load();
    } catch {
      setError('No se pudo guardar el registro. Verifique los datos.');
    }
  }

  async function handleDelete(row: Row) {
    const id = String(row[config.idField]);

    if (!window.confirm(`Eliminar el registro ${id}?`)) {
      return;
    }

    setError(null);

    try {
      await apiClient.delete(`${config.apiPath}/${id}`);
      await load();
    } catch {
      setError('No se pudo eliminar el registro.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>{config.title}</h2>
        <button onClick={startCreate}>Nuevo</button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="entity-form" onSubmit={handleSubmit}>
          {config.fields.map((field) => (
            <label key={field.key}>
              {field.label}
              {field.type === 'select' ? (
                <select
                  value={form[field.key]}
                  disabled={field.key === config.idField && editingId !== null}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required
                >
                  <option value="" disabled>
                    Seleccione...
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={form[field.key] === 'true'}
                  onChange={(e) => setForm({ ...form, [field.key]: String(e.target.checked) })}
                />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  step={field.type === 'number' ? 'any' : undefined}
                  value={form[field.key]}
                  disabled={field.key === config.idField && editingId !== null}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required
                />
              )}
            </label>
          ))}

          <div className="form-actions">
            <button type="submit">{editingId ? 'Guardar cambios' : 'Crear'}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[config.idField])}>
                {config.columns.map((column) => (
                  <td key={column.key}>{String(row[column.key] ?? '')}</td>
                ))}
                <td>
                  <button onClick={() => startEdit(row)}>Editar</button>
                  <button onClick={() => handleDelete(row)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
