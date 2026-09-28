import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { colors } from '../theme/colors';
import { getStats } from '../services/api';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getStats();
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.danger }}>No se pudo conectar: {error}</Text>
      </View>
    );
  }

  const rows = [
    { label: 'Promedio', value: stats?.avgTemp?.toFixed(1), unit: '°C' },
    { label: 'Máxima', value: stats?.maxTemp?.toFixed(1), unit: '°C' },
    { label: 'Mínima', value: stats?.minTemp?.toFixed(1), unit: '°C' },
    { label: 'Humedad promedio', value: stats?.avgHumidity?.toFixed(1), unit: '%' },
    { label: 'Total de lecturas', value: stats?.total, unit: '' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
    >
      {rows.map(r => (
        <Card key={r.label} style={styles.card}>
          <Card.Content style={styles.row}>
            <Text style={{ color: colors.textMuted }}>{r.label}</Text>
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>{r.value ?? '--'}{r.unit}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.surface, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});