import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProductosScreen } from '../screens/ProductosScreen';
import { FacturasScreen } from '../screens/FacturasScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Productos: undefined;
  Facturas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1e3a8a' }, headerTintColor: '#fff' }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Panel principal' }} />
            <Stack.Screen name="Productos" component={ProductosScreen} options={{ title: 'Productos' }} />
            <Stack.Screen name="Facturas" component={FacturasScreen} options={{ title: 'Facturas' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
