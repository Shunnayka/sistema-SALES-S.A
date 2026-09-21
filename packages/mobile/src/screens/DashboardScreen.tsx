import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/RootNavigator';

interface Producto {
  idProducto: string;
  descripcion: string;
  stockActual: number;
  stockMinimo: number;
}

interface Factura {
  numeroFactura: string;
  estado: string;
}

export function DashboardScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [productosRes, facturasRes] = await Promise.all([
        apiClient.get<Producto[]>('/productos'),
        apiClient.get<Factura[]>('/facturas'),
      ]);
      setProductos(productosRes.data);
      setFacturas(facturasRes.data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const bajoStock = productos.filter((p) => p.stockActual <= p.stockMinimo);
  const pendientes = facturas.filter((f) => f.estado === 'pendiente');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Panel principal</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>{productos.length}</Text>
          <Text style={styles.cardLabel}>Productos</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>{bajoStock.length}</Text>
          <Text style={styles.cardLabel}>Bajo stock</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>{pendientes.length}</Text>
          <Text style={styles.cardLabel}>Facturas pendientes</Text>
        </View>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Productos')}>
          <Text style={styles.navButtonText}>Ver Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Facturas')}>
          <Text style={styles.navButtonText}>Ver Facturas</Text>
        </TouchableOpacity>
      </View>

      {bajoStock.length > 0 && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Productos con stock bajo</Text>
          {bajoStock.map((p) => (
            <Text key={p.idProducto} style={styles.panelRow}>
              {p.idProducto} - {p.descripcion} ({p.stockActual}/{p.stockMinimo})
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1e3a8a' },
  logout: { color: '#b91c1c', fontSize: 13 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#dbe1ea' },
  cardNumber: { fontSize: 22, fontWeight: '700', color: '#1e3a8a' },
  cardLabel: { fontSize: 12, color: '#6b7280' },
  navRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  navButton: { flex: 1, backgroundColor: '#1e3a8a', borderRadius: 8, padding: 12, alignItems: 'center' },
  navButtonText: { color: '#fff', fontWeight: '600' },
  panel: { backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#dbe1ea' },
  panelTitle: { fontWeight: '600', marginBottom: 8 },
  panelRow: { fontSize: 13, color: '#374151', marginBottom: 4 },
});
