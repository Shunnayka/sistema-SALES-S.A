import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '../api/client';

interface Factura {
  numeroFactura: string;
  idCliente: string;
  idVendedor: string;
  estado: 'pendiente' | 'cancelada' | 'anulada';
  total: number;
}

export function FacturasScreen() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await apiClient.get<Factura[]>('/facturas');
      setFacturas(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function handleCancelar(numero: string) {
    try {
      await apiClient.post(`/facturas/${numero}/cancelar`);
      await load();
    } catch {
      Alert.alert('Error', 'No se pudo cancelar la factura.');
    }
  }

  async function handleAnular(numero: string) {
    try {
      await apiClient.post(`/facturas/${numero}/anular`);
      await load();
    } catch {
      Alert.alert('Error', 'No se pudo anular la factura.');
    }
  }

  return (
    <FlatList
      style={styles.container}
      data={facturas}
      keyExtractor={(item) => item.numeroFactura}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.rowTitle}>{item.numeroFactura}</Text>
          <Text style={styles.rowSubtitle}>
            Cliente: {item.idCliente} | Vendedor: {item.idVendedor}
          </Text>
          <Text style={styles.rowSubtitle}>
            Estado: {item.estado} | Total: ${item.total.toFixed(2)}
          </Text>
          {item.estado === 'pendiente' && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleCancelar(item.numeroFactura)}>
                <Text style={styles.actionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleAnular(item.numeroFactura)}>
                <Text style={styles.actionText}>Anular</Text>
              </TouchableOpacity>
            </View>
          )}
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
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { backgroundColor: '#1e3a8a', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 10 },
  actionText: { color: '#fff', fontSize: 12 },
});
