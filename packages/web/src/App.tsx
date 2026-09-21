import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductosPage } from './pages/ProductosPage';
import { FacturasPage } from './pages/FacturasPage';
import { OrdenesCompraPage } from './pages/OrdenesCompraPage';
import { CrudPage } from './crud/CrudPage';
import { distritoConfig, clienteConfig, proveedorConfig, vendedorConfig } from './config/entities';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/distritos" element={<CrudPage config={distritoConfig} />} />
              <Route path="/clientes" element={<CrudPage config={clienteConfig} />} />
              <Route path="/proveedores" element={<CrudPage config={proveedorConfig} />} />
              <Route path="/vendedores" element={<CrudPage config={vendedorConfig} />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/facturas" element={<FacturasPage />} />
              <Route path="/ordenes-compra" element={<OrdenesCompraPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
