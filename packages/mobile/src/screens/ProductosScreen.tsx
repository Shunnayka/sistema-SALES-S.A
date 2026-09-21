import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '../api/client';

interface Producto {
  idProducto: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  marca: string;
}

export function ProductosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await apiClient.get<Producto[]>('/productos');
      setProductos(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <FlatList
      style={styles.container}
      data={productos}
      keyExtractor={(item) => item.idProducto}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.rowTitle}>
            {item.idProducto} - {item.descripcion}
          </Text>
          <Text style={styles.rowSubtitle}>
            {item.marca} | Precio: ${item.precio.toFixed(2)} | Stock: {item.stockActual} (min. {item.stockMinimo})
          </Text>
          {item.stockActual <= item.stockMinimo && <Text style={styles.warning}>Necesita reabastecimiento</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', padding: 12 },
  row: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#dbe1ea' },
  rowTitle: { fontWeight: '600', marginBottom: 2 },
  rowSubtitle: { fontSize: 12, color: '#6b7280' },
  warning: { fontSize: 12, color: '#b91c1c', marginTop: 4 },
});
