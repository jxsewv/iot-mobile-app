import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';
import { getAllReadings } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllReadings(20); // últimas 20 lecturas
      setReadings(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.danger }}>No se pudo conectar: {error}</Text>
      </View>
    );
  }

  // el API entrega más reciente primero; la gráfica se ve mejor en orden cronológico
  const chronological = [...readings].reverse();

  const chartData = {
    labels: chronological.map(r =>
      new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ).filter((_, i) => i % Math.ceil(chronological.length / 5 || 1) === 0), // no saturar el eje
    datasets: [{ data: chronological.map(r => r.temperature) }],
  };

  return (
    <FlatList
      style={styles.container}
      data={readings}
      keyExtractor={item => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
      ListHeaderComponent={
        readings.length > 1 ? (
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={200}
            yAxisSuffix="°C"
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 1,
              color: () => colors.primary,
              labelColor: () => colors.textMuted,
              propsForDots: { r: '3' },
            }}
            style={{ borderRadius: 12, marginBottom: 16 }}
          />
        ) : (
          <Text style={{ color: colors.textMuted, marginBottom: 16 }}>
            Se necesitan al menos 2 lecturas para graficar
          </Text>
        )
      }
      ListEmptyComponent={<Text style={{ color: colors.textMuted }}>Sin lecturas aún</Text>}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Content style={styles.cardRow}>
            <View>
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.temperature}°C</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>Humedad: {item.humidity}%</Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.surface, marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});