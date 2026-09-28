import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { colors } from '../theme/colors';
import { getLatestReadings } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getLatestReadings(1);
      setReading(data[0] || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresca cada 30s
    return () => clearInterval(interval);
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
    >
      <Text variant="titleMedium" style={styles.label}>Temperatura actual</Text>

      {loading && <ActivityIndicator style={{ marginVertical: 20 }} />}

      {!loading && error && (
        <Text style={{ color: colors.danger, marginVertical: 12 }}>No se pudo conectar: {error}</Text>
      )}

      {!loading && !error && reading && (
        <>
          <Text variant="displayLarge" style={styles.temp}>{reading.temperature}°C</Text>
          <Text variant="bodyMedium" style={styles.sub}>Humedad: {reading.humidity}%</Text>
          <Text variant="bodySmall" style={styles.sub}>
            Última lectura: {new Date(reading.date).toLocaleString()}
          </Text>
        </>
      )}

      {!loading && !error && !reading && (
        <Text style={styles.sub}>Aún no hay lecturas registradas</Text>
      )}

      <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Historial')}>
        Ver historial
      </Button>
      <Button mode="text" style={styles.button} onPress={() => navigation.navigate('Estadísticas')}>
        Ver estadísticas
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 20 },
  label: { color: colors.textMuted },
  temp: { color: colors.text, fontWeight: 'bold', marginVertical: 8 },
  sub: { color: colors.textMuted, marginBottom: 12 },
  button: { marginTop: 20 },
});