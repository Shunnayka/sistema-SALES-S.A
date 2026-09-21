import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const links = [
  { to: '/', label: 'Panel', end: true },
  { to: '/distritos', label: 'Distritos' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/vendedores', label: 'Vendedores' },
  { to: '/productos', label: 'Productos' },
  { to: '/facturas', label: 'Facturas' },
  { to: '/ordenes-compra', label: 'Ordenes de Compra' },
];

export function Layout() {
  const { logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>SISTEMA_SALES</h1>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout" onClick={logout}>
          Cerrar sesion
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
